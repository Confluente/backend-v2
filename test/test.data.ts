import request from "supertest";

import {generateSalt, getPasswordHashSync} from "../src/helpers/auth.helper";
import {all} from "q";
import {Role} from "../src/models/database/role.model";
import {User} from "../src/models/database/user.model";
import {Group} from "../src/models/database/group.model";
import {Activity} from "../src/models/database/activity.model";
import {Page} from "../src/models/database/page.model";
import {CompanyOpportunity} from "../src/models/database/company.opportunity.model";
import {roles} from "../src/import_initial";
import * as supertest from "supertest";
import {authenticate} from "./test.helper";

const password = "HonoursWorthyPassword";
const passwordSaltExample = generateSalt(16);

export const superAdmin = {
    id: 1,
    email: "superadmin",
    displayName: "Super Administrator",
    firstName: "Super",
    lastName: "Administrator",
    honorsMembership: "member",
    approvingHash: "da;lkfjda;fjkad;fj",
    passwordSalt: passwordSaltExample,
    passwordHash: getPasswordHashSync(password, passwordSaltExample),
    password: password,
    approved: true,
    roleId: 1,
};

export const admin = {
    id: 2,
    email: "admin",
    displayName: "Administrator",
    firstName: "Just",
    lastName: "Administrator",
    honorsMembership: "member",
    approvingHash: "da;lkfjda;fjkad;fj",
    passwordSalt: passwordSaltExample,
    passwordHash: getPasswordHashSync(password, passwordSaltExample),
    password: password,
    approved: true,
    roleId: 2,
    groups: [10],
    functions: ["Member"]
};

export const boardMember = {
    id: 3,
    email: "boardmember@student.tue.nl",
    displayName: "Board Member",
    firstName: "Board",
    lastName: "Member",
    honorsMembership: "member",
    approvingHash: "da;lkfjda;fjkad;fj",
    passwordSalt: passwordSaltExample,
    passwordHash: getPasswordHashSync(password, passwordSaltExample),
    password: password,
    approved: true,
    roleId: 4,
    groups: [1],
    functions: ["Member"]
};

export const activeMember = {
    id: 4,
    email: "activemember1@student.tue.nl",
    displayName: "Active1 Member",
    firstName: "Active1",
    lastName: "Member",
    honorsMembership: "member",
    approvingHash: "da;lkfjda;fjkad;fj",
    passwordSalt: passwordSaltExample,
    passwordHash: getPasswordHashSync(password, passwordSaltExample),
    password: password,
    approved: true,
    roleId: 3,
    groups: [1, 2],
    functions: ["Chair", "Secretary"],
    activities: [2],
    answers: ["Active1 Member#,#activemember1@student.tue.nl#,#Kapowowowskies#,#woof"]
};

export const nonActiveMember = {
    id: 5,
    email: "nonactivemember@student.tue.nl",
    displayName: "NonActive Member",
    firstName: "NonActive",
    lastName: "Member",
    honorsMembership: "member",
    approvingHash: "da;lkfjda;fjkad;fj",
    passwordSalt: passwordSaltExample,
    passwordHash: getPasswordHashSync(password, passwordSaltExample),
    password: password,
    approved: true,
    roleId: 3,
};

export function getAgent(server: any): supertest.SuperAgentTest {
    const agent = request.agent(server);

    agent.use((a) => {
        a.set("X-Requested-With", "XMLHttpRequest");
    });

    return agent;
}

export const organizingGroup = {
    id: 1,
    displayName: "OG",
    fullName: "Organizing Group",
    description: "Non empty description",
    canOrganize: false,
    email: "og@hsaconfluente.nl",
    type: "committee"
};

export const nonOrganizingGroup = {
    id: 2,
    displayName: "NOG",
    fullName: "Non Organizing Group",
    description: "Non empty description",
    canOrganize: false,
    email: "nog@hsaconfluente.nl",
    type: "committee"
};

export const member = {
    email: "alice@hsaconfluente.nl",
    firstName: "Alice",
    lastName: "Memberoni",
    displayName: "Alice Memberoni",
    honorsMembership: "Member",
    consentWithPortraitRight: true,
    approved: true,
    approvingHash: "approved_random_hash",
    passwordSalt: passwordSaltExample,
    passwordHash: getPasswordHashSync(password, passwordSaltExample)
};

export const unpublishedActivity = {
    id: 1,
    name: "The first ever activity!",
    description: "Wuuuuut its an activity!",
    location: "SOMEEEEWHERE OVER THE RAINBOW",
    date: new Date(),
    startTime: "18:00",
    endTime: "20:00",
    participationFee: 8.5,
    organizerId: 1,
    published: false,
    hasCoverImage: false,
};

export const publishedActivityWithSubscriptionForm = {
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
    organizerId: 1

};

export const companyOpportunity = {
    title: "Super duper cool vacancy",
    companyName: "Some sponsor",
    description: "Super cool description",
    imageUrl: "some url",
    contactEmail: "some email",
    link: "A link to vacancy of the sponsor",
    educationLevel: "Pleb",
    category: "Vacancy"
};

export const page = {
    url: "super cool url",
    title: "super cool page",
    content: "super cool content",
    author: "Marijn Stijvers"
};

export const roleSuperAdmin = {
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
};

export const roleNotLoggedIn = {
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
};

export const session = {
    token: Buffer.from("something"),
    userId: 1,
    ip: "funky ip address",
    expires: new Date()
};

const users = [superAdmin, admin, boardMember, activeMember, nonActiveMember];
const activities = [unpublishedActivity, publishedActivityWithSubscriptionForm];

export async function initTestData(server: any): Promise<any> {
    return all([
        await Role.bulkCreate(roles),
        await User.bulkCreate(users),
        await Group.bulkCreate([organizingGroup, nonOrganizingGroup]),
        await Activity.bulkCreate(activities),
        await Page.create(page),
        await CompanyOpportunity.create(companyOpportunity),
    ]).then(async function(): Promise<any> {
        activities.forEach(function(actData: any): void {
            Group.findByPk(actData.organizerId).then(function(group: Group): void {
                Activity.findByPk(actData.id).then(function(act: Activity): void {
                    group.$add('activities', act);
                });
            });
        });

        users.forEach(function(userData: any): void {
            User.findByPk(userData.id).then(function(user: User): void {
                if (!userData.functions || !userData.groups) {
                } else if (userData.functions.length !== userData.groups.length) {
                } else {
                    for (let i = 0; i < userData.groups.length; i++) {
                        Group.findByPk(userData.groups[i]).then(function(group: Group): void {
                            user.$add('groups', group, {through: {func: userData.functions[i]}})
                                .catch(function(err: Error): void {
                                    console.log(err);
                                });
                        });
                    }
                }

                if (!userData.activities) {
                } else if (userData.activities && userData.activities.length === userData.answers.length) {
                    for (let i = 0; i < userData.activities.length; i++) {
                        Activity.findByPk(userData.activities[i]).then(function(activity: Activity): void {
                            user.$add('activities', activity, {through: {answers: userData.answers[i]}});
                        });
                    }
                }
            });
        });

        const superAdminAgent = getAgent(server);
        const adminAgent = getAgent(server);
        const boardMemberAgent = getAgent(server);
        const activeMemberAgent = getAgent(server);
        const nonActiveMemberAgent = getAgent(server);
        const nobodyUserAgent = getAgent(server);

        await authenticate(superAdminAgent, superAdmin);
        await authenticate(adminAgent, admin);
        await authenticate(boardMemberAgent, boardMember);
        await authenticate(activeMemberAgent, activeMember);
        await authenticate(nonActiveMemberAgent, nonActiveMember);

        const agents = {
            superAdminAgent,
            adminAgent,
            boardMemberAgent,
            activeMemberAgent,
            nonActiveMemberAgent,
            nobodyUserAgent,
        };

        agents.superAdminAgent = superAdminAgent;
        agents.adminAgent = adminAgent;
        agents.boardMemberAgent = boardMemberAgent;
        agents.activeMemberAgent = activeMemberAgent;
        agents.nonActiveMemberAgent = nonActiveMemberAgent;
        agents.nobodyUserAgent = nobodyUserAgent;

        return agents;
    });
}
