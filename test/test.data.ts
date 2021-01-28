import request from "supertest";

import {app} from "../src/expressServer";
import {getPasswordHashSync} from "../src/helpers/auth.helper";

const password = "HonoursWorthyPassword";
const passwordSaltBuffer = new Buffer("BlahBlah");

export const user = {
    email: "superadmin",
    displayName: "Super Administrator",
    firstName: "Super",
    lastName: "Administrator",
    honorsMembership: "member",
    approvingHash: "da;lkfjda;fjkad;fj",
    passwordHash: Buffer.from("tfExQFTNNT/gMWGfe5Z8CGz2bvBjoAoE7Mz7pmWd6/g=", "base64"),
    passwordSalt: Buffer.from("LAFU0L7mQ0FhEmPybJfHDiF11OAyBFjEIj8/oBzVZrM=", "base64"),
    roleId: 1
};

function getAgent(): any {
    return request.agent(app).use((a) => {
        a.set("X-Requested-With", "XMLHttpRequest");
    });
}

export const nonOrganizingGroup = {
    displayName: "NOG",
    fullName: "Non Organizing Group",
    description: "Non empty description",
    canOrganize: false,
    email: "nog@hsaconfluente.nl",
    type: "committee"
};

export const organizingGroup = {
    displayName: "OG",
    fullName: "Organizing Group",
    description: "Non empty description",
    canOrganize: false,
    email: "og@hsaconfluente.nl",
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
    passwordSalt: passwordSaltBuffer,
    passwordHash: getPasswordHashSync(password, passwordSaltBuffer.toString())
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
    OrganizerId: 2,
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
    OrganizerId: 3
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

export const role = {
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

export const session = {
    token: new Buffer("something"),
    user: 1,
    ip: "funky ip address",
    expires: new Date()
};
