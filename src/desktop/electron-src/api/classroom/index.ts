import { OAuth2Client } from "google-auth-library";
import { google, classroom_v1 } from "googleapis";
import { getAuth } from "../login";
import fs from "fs"

// コース情報取得
export const getCourse = (auth: any, nest?: boolean) => {
    return new Promise<classroom_v1.Schema$Course[]>((resolve, reject) => {
        try {
            const classroom = google.classroom({ version: "v1", auth });

            classroom.courses.list({
                courseStates: ["ACTIVE"]
            }, async (err, res) => {
                if (err || !res) {
                    if (nest) {
                        console.log(err || "404 res");

                        reject(err || "404 res")
                        return
                    }
                    const auth = await getAuth()
                    const list = await getCourse(auth, true)
                    resolve(list)
                    return
                }
                const courses = res.data.courses;
                if (courses && courses.length) {
                    resolve(courses)
                    return;
                } else {
                    reject("404 courses")
                    return;
                }
            })
        } catch (error) {
            console.log("catch error", error);

            reject(error)
        }
    })
}

// 日本の時間を取得
function getJaData(year: number, month: number, day: number, hours: number, minutes: number,) {
    let dt = new Date(year, month - 1, day, hours, minutes, 0);
    dt.setHours(dt.getHours() + 9);
    return {
        dueDate: {
            year: dt.getFullYear(),
            month: dt.getMonth() + 1,
            day: dt.getDate(),
        }, dueTime: {
            hours: dt.getHours(),
            minutes,
            seconds: 0
        }
    }
}

// 課題を取得
export const getWorks = (courseId: string, auth: any, pageToken?: string, nest?: boolean) => {
    return new Promise((resolve, reject) => {
        try {
            const classroom = google.classroom({ version: "v1", auth });

            classroom.courses.courseWork.list({ courseId, pageSize: 5, orderBy: "dueDate asc", pageToken }, async (err, res) => {
                if (err || !res) {
                    if (nest) {
                        reject(err || "404 res")
                        return
                    }
                    const list = await getWorks(courseId, auth, pageToken, true)
                    resolve(list)
                    return
                }

                const works = res.data.courseWork;
                if (!works || works.length === 0) {
                    reject("404 courses")
                    return;
                }
                let workA = []
                for (const work of works) {
                    if (!work.id) {
                        continue
                    }
                    if (work.dueDate && work.dueTime) {
                        // 日本の時間に変換
                        const { year, month, day } = work.dueDate;
                        const { hours, minutes } = work.dueTime;
                        const jaDate = getJaData(year || 0, month || 0, day || 0, hours || 0, minutes || 0);
                        work.dueDate = jaDate.dueDate;
                        work.dueTime = jaDate.dueTime;
                    }

                    // 課題の状態を取得
                    const state = await getWorkState(classroom, courseId, work.id)
                    if (!state) {
                        continue
                    }
                    workA.push({ ...work, ...state })
                }
                resolve({ works: workA, pageToken: res.data.nextPageToken })
                return;
            })
        } catch (error) {
            reject(error)
        }
    })
}

// 課題の状態を取得
export const getWorkState = (
    classroom: classroom_v1.Classroom,
    courseId: string,
    courseWorkId: string,
    nest: boolean = false
): Promise<false | classroom_v1.Schema$StudentSubmission> => {
    return classroom.courses.courseWork.studentSubmissions.list({
        courseId,
        courseWorkId,
        states: ["CREATED", "NEW"]
    }).then((res) => {
        if (!res.data.studentSubmissions) {
            return false;
        }
        return res.data.studentSubmissions.length ? res.data.studentSubmissions[0] : false;
    }).catch(async error => {
        console.log("work_state_error", error);
        if (nest) {
            return false;
        }
        return await getWorkState(classroom, courseId, courseWorkId, true)
    })

}

// ファイルをGoogle Driveにアップロード
export const uploadFile = async (
    auth: OAuth2Client,
    classroom: { courseId: string, courseWorkId: string, id: string },
    file: { fileName: string, filePath: string }
) => {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.create({
        media: {
            body: fs.createReadStream(file.filePath)
        },
        requestBody: {
            name: file.fileName,
            parents: [],

        }
    }).then((file) => {
        const { webViewLink, id, thumbnailLink, name } = file.data;
        console.log(id, "id");
        console.log(webViewLink, "webViewLink");
        console.log(thumbnailLink, "thumbnailLink");
        console.log(name, "name");
        fileS(auth, classroom, { id, title: name, alternateLink: webViewLink, thumbnailUrl: thumbnailLink })
    }).catch((err) => {
        console.log(err, "err");

    })

}


// 課題を提出
export const fileS = (auth: OAuth2Client,
    option: { courseId: string, courseWorkId: string, id: string },
    file: { id?: string | null, title?: string | null, alternateLink?: string | null, thumbnailUrl?: string | null }) => {
    const classroom = google.classroom({ version: "v1", auth });
    const { id, courseId, courseWorkId } = option
    console.log("id:", id);
    console.log("courseId:", courseId);
    console.log("courseWorkId: ", courseWorkId);
    classroom.courses.courseWork.studentSubmissions.modifyAttachments({
        id, courseWorkId, courseId, requestBody: {
            addAttachments: [{
                driveFile: {
                    id: file.id
                }
            }]
        }
    }).then(() => {
        console.log("提出完了？");

    }).catch((err) => {
        console.log("error", "classroom_添付", err);
    })
}

// アナウンス情報取得
export const getAnnouncement = (
    auth: any,
    option: any,
    nest?: boolean
): Promise<{
    announcements: classroom_v1.Schema$Announcement[],
    pageToken: any
} | false> => {
    const classroom = google.classroom({ version: "v1", auth })
    return classroom.courses.announcements.list({ ...option, pageSize: 30, }).then((res) => {
        if (!res.data.announcements) {
            return false
        }
        return { announcements: res.data.announcements, pageToken: res.data.nextPageToken }
    }).catch(async error => {
        console.log("work_state_error", error);
        if (nest) {
            return false
        }
        return await getAnnouncement(await getAuth(), option, true)
    })
}

// 課題の資料の取得
export const getCourseWorkMaterials = (auth: OAuth2Client, option: any, nest?: boolean): Promise<false | any> => {
    const classroom = google.classroom({ version: "v1", auth })
    return classroom.courses.courseWorkMaterials.list({ ...option, pageSize: 30, }).then((res) => {
        if (!res.data.courseWorkMaterial) {
            return false
        }
        return { courseWorkMaterial: res.data.courseWorkMaterial, pageToken: res.data.nextPageToken }
    }).catch(async error => {
        console.log("work_state_error", error);
        if (nest) {
            return false
        }
        return await getCourseWorkMaterials(await getAuth(), option, true)
    })
}