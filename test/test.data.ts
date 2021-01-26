import request from "supertest";

import {app} from "../src/expressServer";
import {getPasswordHashSync} from "../src/helpers/authHelper";

const password = "HonoursWorthyPassword";
const passwordSaltBuffer = new Buffer("BlahBlah");

export const testUser = {
    displayName: "Bob",
    email: "bob@hsaconfluente.nl",
    password: "ILikeTrains",
    passwordSalt: new Buffer("BlahBlah")
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
    published: false
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


