import {all} from 'q';

import {Activity} from "./models/Activity";
import {User} from "./models/User";
import {Group} from "./models/Group";
import {Role} from "./models/Role";

import fs from 'fs';

if (!fs.existsSync("./data.sqlite")) {
    // database does not yet exist! great :)
} else {
    fs.unlinkSync("./data.sqlite");
    // throw new Error("Delete the database (data.sqlite) before generating a new one");
}

// Standard roles
const roles = [
    {
        id: 1,
        name: "Super admin",
        // Pages
        PAGE_VIEW: true,
        PAGE_MANAGE: true,
        // Users
        USER_CREATE: true,
        USER_VIEW_ALL: true,
        USER_MANAGE: true,
        CHANGE_ALL_PASSWORDS: true,
        // Roles
        ROLE_VIEW: true,
        ROLE_MANAGE: true,
        // Groups
        GROUP_VIEW: true,
        GROUP_MANAGE: true,
        GROUP_ORGANIZE_WITH_ALL: true,
        // Activities
        ACTIVITY_VIEW_PUBLISHED: true,
        ACTIVITY_VIEW_ALL_UNPUBLISHED: true,
        ACTIVITY_MANAGE: true
    },
    {
        id: 2,
        name: "Admin",
        // Pages
        PAGE_VIEW: true,
        PAGE_MANAGE: true,
        // Users
        USER_CREATE: true,
        USER_VIEW_ALL: false,
        USER_MANAGE: false,
        CHANGE_ALL_PASSWORDS: false,
        // Roles
        ROLE_VIEW: true,
        ROLE_MANAGE: false,
        // Groups
        GROUP_VIEW: true,
        GROUP_MANAGE: false,
        GROUP_ORGANIZE_WITH_ALL: false,
        // Activities
        ACTIVITY_VIEW_PUBLISHED: true,
        ACTIVITY_VIEW_ALL_UNPUBLISHED: false,
        ACTIVITY_MANAGE: false
    },
    {
        id: 3,
        name: "Regular member",
        // Pages
        PAGE_VIEW: true,
        PAGE_MANAGE: false,
        // Users
        USER_CREATE: true,
        USER_VIEW_ALL: false,
        USER_MANAGE: false,
        CHANGE_ALL_PASSWORDS: false,
        // Roles
        ROLE_VIEW: false,
        ROLE_MANAGE: false,
        // Groups
        GROUP_VIEW: true,
        GROUP_MANAGE: false,
        GROUP_ORGANIZE_WITH_ALL: false,
        // Activities
        ACTIVITY_VIEW_PUBLISHED: true,
        ACTIVITY_VIEW_ALL_UNPUBLISHED: false,
        ACTIVITY_MANAGE: false
    },
    {
        id: 4,
        name: "Board member",
        // Pages
        PAGE_VIEW: true,
        PAGE_MANAGE: false,
        // Users
        USER_CREATE: true,
        USER_VIEW_ALL: true,
        USER_MANAGE: true,
        CHANGE_ALL_PASSWORDS: false,
        // Roles
        ROLE_VIEW: false,
        ROLE_MANAGE: false,
        // Groups
        GROUP_VIEW: true,
        GROUP_MANAGE: true,
        GROUP_ORGANIZE_WITH_ALL: true,
        // Activities
        ACTIVITY_VIEW_PUBLISHED: true,
        ACTIVITY_VIEW_ALL_UNPUBLISHED: true,
        ACTIVITY_MANAGE: true
    },
    {
        id: 5,
        name: "Not logged in",
        // Pages
        PAGE_VIEW: true,
        PAGE_MANAGE: false,
        // Users
        USER_CREATE: true,
        USER_VIEW_ALL: false,
        USER_MANAGE: false,
        CHANGE_ALL_PASSWORDS: false,
        // Roles
        ROLE_VIEW: false,
        ROLE_MANAGE: false,
        // Groups
        GROUP_VIEW: true,
        GROUP_MANAGE: false,
        GROUP_ORGANIZE_WITH_ALL: false,
        // Activities
        ACTIVITY_VIEW_PUBLISHED: true,
        ACTIVITY_VIEW_ALL_UNPUBLISHED: false,
        ACTIVITY_MANAGE: false
    }
];

// Initial accounts
const users = [
    {
        id: 1,
        email: "superadmin",
        displayName: "Super Administrator",
        firstName: "Super",
        lastName: "Administrator",
        honorsMembership: "member",
        mobilePhoneNumber: "somenumber",
        approvingHash: "da;lkfjda;fjkad;fj",
        passwordHash: Buffer.from("tfExQFTNNT/gMWGfe5Z8CGz2bvBjoAoE7Mz7pmWd6/g=", "base64"),
        passwordSalt: Buffer.from("LAFU0L7mQ0FhEmPybJfHDiF11OAyBFjEIj8/oBzVZrM=", "base64"),
        approved: true,
        RoleId: 1,
        groups: [10],
        functions: ["Chair"]
    },
    {
        id: 2,
        email: "admin",
        displayName: "Administrator",
        firstName: "Just",
        lastName: "Administrator",
        honorsMembership: "member",
        mobilePhoneNumber: "somenumber",
        approvingHash: "da;lkfjda;fjkad;fj",
        passwordHash: Buffer.from("tfExQFTNNT/gMWGfe5Z8CGz2bvBjoAoE7Mz7pmWd6/g=", "base64"),
        passwordSalt: Buffer.from("LAFU0L7mQ0FhEmPybJfHDiF11OAyBFjEIj8/oBzVZrM=", "base64"),
        approved: true,
        RoleId: 2,
        groups: [10],
        functions: ["Member"]
    },
    {
        id: 3,
        email: "boardmember",
        displayName: "Board Member",
        firstName: "Board",
        lastName: "Member",
        honorsMembership: "member",
        mobilePhoneNumber: "somenumber",
        approvingHash: "da;lkfjda;fjkad;fj",
        passwordHash: Buffer.from("tfExQFTNNT/gMWGfe5Z8CGz2bvBjoAoE7Mz7pmWd6/g=", "base64"),
        passwordSalt: Buffer.from("LAFU0L7mQ0FhEmPybJfHDiF11OAyBFjEIj8/oBzVZrM=", "base64"),
        approved: true,
        RoleId: 4,
        groups: [1],
        functions: ["Member"]
    },
    {
        id: 4,
        email: "activemember1@student.tue.nl",
        displayName: "Active1 Member",
        firstName: "Active1",
        lastName: "Member",
        honorsMembership: "member",
        mobilePhoneNumber: "somenumber",
        approvingHash: "da;lkfjda;fjkad;fj",
        passwordHash: Buffer.from("tfExQFTNNT/gMWGfe5Z8CGz2bvBjoAoE7Mz7pmWd6/g=", "base64"),
        passwordSalt: Buffer.from("LAFU0L7mQ0FhEmPybJfHDiF11OAyBFjEIj8/oBzVZrM=", "base64"),
        approved: true,
        RoleId: 3,
        groups: [3, 4],
        functions: ["Chair", "Secretary"],
        activities: [2],
        answers: ["Active1 Member#,#activemember1@student.tue.nl#,#Kapowowowskies#,#woof"]
    },
    {
        id: 5,
        email: "activemember2@student.tue.nl",
        displayName: "Active2 Member",
        firstName: "Active2",
        lastName: "Member",
        honorsMembership: "member",
        mobilePhoneNumber: "somenumber",
        approvingHash: "da;lkfjda;fjkad;fj",
        passwordHash: Buffer.from("tfExQFTNNT/gMWGfe5Z8CGz2bvBjoAoE7Mz7pmWd6/g=", "base64"),
        passwordSalt: Buffer.from("LAFU0L7mQ0FhEmPybJfHDiF11OAyBFjEIj8/oBzVZrM=", "base64"),
        approved: true,
        RoleId: 3,
        groups: [3],
        functions: ["Member"]
    },
    {
        id: 6,
        email: "activemember3@student.tue.nl",
        displayName: "Active3 Member",
        firstName: "Active3",
        lastName: "dupermin",
        honorsMembership: "Member",
        mobilePhoneNumber: "somenumber",
        approvingHash: "da;lkfjda;fjkad;fj",
        passwordHash: Buffer.from("tfExQFTNNT/gMWGfe5Z8CGz2bvBjoAoE7Mz7pmWd6/g=", "base64"),
        passwordSalt: Buffer.from("LAFU0L7mQ0FhEmPybJfHDiF11OAyBFjEIj8/oBzVZrM=", "base64"),
        approved: true,
        RoleId: 3,
        groups: [4],
        functions: ["Treasurer"],
        activities: [2],
        answers: ["Active2 Member#,#activemember2@student.tue.nl#,#Kachawakaas#,#wooferdiedoofdoof"]
    }
];

// Initial groups
const groups: any[] = [
    {
        id: 1,
        displayName: "Confluente",
        fullName: "H.S.A. Confluente",
        canOrganize: true,
        email: "board@hsaconfluente.nl",
        type: "Board",
        description: "Non empty Description"
    },
    {
        id: 2,
        displayName: "Advisory Board",
        fullName: "H.S.A. Confluente Advisory Board",
        canOrganize: false,
        email: "board@hsaconfluente.nl",
        type: "Board",
        description: "Group for the Advisory Board."
    },
    {
        id: 3,
        displayName: "Acquisition Committee",
        fullName: "Acquisition Committee",
        description: "The acquisition committee is responsible for making and maintaining professional partnerships between the industry and H.S.A. Confluente.",
        canOrganize: true,
        email: "acquisition@hsaconfluente.nl",
        type: "Committee"
    },
    {
        id: 4,
        displayName: "Activity Committee",
        fullName: "Activity Committee",
        description: "The activity committee organizes super duper awesome recreational events! These can range from small lunch break high teas to two hours of paint-balling to an enormous 20 hour dropping!",
        canOrganize: true,
        email: "activity@hsaconfluente.nl",
        type: "Committee"
    },
    {
        id: 5,
        displayName: "EDU Committee",
        fullName: "Educational Committee",
        description: "The educational committee is responsible for organizing educational events for the members of H.S.A. Confluente.",
        canOrganize: true,
        email: "educational@hsaconfluente.nl",
        type: "Committee"
    },
    {
        id: 6,
        displayName: "Gala Committee",
        fullName: "Gala Committee",
        description: "The gala committee is responsible for organizing the amazing H.S.A. Confluente gala!",
        canOrganize: true,
        email: "gala@hsaconfluente.nl",
        type: "Committee"
    },
    {
        id: 7,
        displayName: "Intro Committee",
        fullName: "Intro Committee",
        description: "No description just yet",
        canOrganize: true,
        email: "intro@hsaconfluente.nl",
        type: "Committee"
    },
    {
        id: 8,
        displayName: "PR Committee",
        fullName: "PR Committee",
        description: "The PR committee is responsible for promotion of H.S.A. Confluente. They also create the magazine of H.S.A. Confluente.",
        canOrganize: true,
        email: "pr@hsaconfluente.nl",
        type: "Committee"
    },
    {
        id: 9,
        displayName: "Studytrip Committee",
        fullName: "Studytrip Committee",
        description: "The studytrip committee organizes the studytrip during the summer for members of H.S.A. Confluente.",
        canOrganize: true,
        email: "studytrip@hsaconfluente.nl",
        type: "Committee"
    },
    {
        id: 10,
        displayName: "Web Committee",
        fullName: "Web Committee",
        description: "Maintaining and developing the website of H.S.A. Confluente,",
        canOrganize: true,
        email: "web@hsaconfluente.nl",
        type: "Committee"
    }
];

// initial activities
const activities: any[] = [
    {
        id: 1,
        name: "The first ever activity!",
        description: "Wuuuuut its an activity!",
        location: "SOMEEEEWHERE OVER THE RAINBOW",
        date: new Date(),
        startTime: "18:00",
        endTime: "20:00",
        participationFee: 8.5,
        OrganizerId: 2
    },
    {
        id: 2,
        name: "The first activity that you can subscribe to!",
        description: "Subscription forms!! How advanced!!",
        location: "Completely in the dark",
        date: (new Date()).setDate((new Date()).getDate() + 1),
        startTime: "01:00",
        endTime: "05:00",
        canSubscribe: true,
        numberOfQuestions: 4,
        typeOfQuestion: "name#,#TU/e email#,#☰ text#,#◉ multiple choice",
        questionDescriptions: "Name#,#TU/e email#,#What kind of dog breed do you like?#,#What sound does a dog make?",
        formOptions: "lk#,#lk#,#lk#,#Woof#;#Woofdiedoofdoof#;#Wafferdafdaf",
        privacyOfQuestions: "false#,#false#,#false#,#false",
        required: "true#,#true#,#true#,#false",
        subscriptionDeadline: (new Date()).setDate((new Date()).getDate() + 1),
        published: true,
        OrganizerId: 3
    }
];

// Import initial administrator and initial group to database
all([
    Role.bulkCreate(roles).then(function(result: any): void {
        console.log("Created roles");
    }),
    User.bulkCreate(users).then(function(result: any): void {
        console.log("Created users");
    }),
    Group.bulkCreate(groups).then(function(result: any): void {
        console.log("Created groups");
    }),
    Activity.bulkCreate(activities).then(function(result: any): void {
        console.log("Created activities");
    })
]).then(function(): any {
    const promises: any[] = [];

    users.forEach(function(userData: any): void {
        const promise = User.findByPk(userData.email).then(function(user: User): void {
            if (!userData.functions || !userData.groups) {
            } else if (userData.functions.length !== userData.groups.length) {
            } else {
                for (let i = 0; i < userData.functions.length; i++) {
                    user.addGroup(userData.groups[i], {through: {func: userData.functions[i]}});
                }
            }

            if (!userData.activities) {

            } else if (userData.activities && userData.activities.length === userData.answers.length) {
                for (let i = 0; i < userData.activities.length; i++) {
                    Activity.findByPk(userData.activities[i]).then(function(activity: Activity): void {
                        user.addActivity(activity, {through: {answers: userData.answers[i]}});
                    });
                }
            }
        });
        promises.push(promise);
    });

    return all(promises);
}).then(function(): void {
    console.log("Done!");
}).done();
