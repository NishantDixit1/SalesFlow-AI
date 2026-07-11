import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";

import { User } from "./models/User.js";
import { Lead } from "./models/Lead.js";
import { Contact } from "./models/Contact.js";
import { Note } from "./models/Note.js";
import { Task } from "./models/Task.js";

const USER_EMAIL = "divyanshdixit2001@gmail.com";
const USER_PASSWORD = "Test@1234";

const seed = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing data...");

    await Promise.all([
      User.deleteMany({}),
      Lead.deleteMany({}),
      Contact.deleteMany({}),
      Note.deleteMany({}),
      Task.deleteMany({}),
    ]);

    console.log("✅ Database cleared");

    console.log("👤 Creating demo user...");

    const user = await User.create({
      name: "Divyansh Dixit",
      email: USER_EMAIL,
      password: USER_PASSWORD,
      company: "SalesFlow AI",
      role: "owner",
    });

    console.log("✅ User created");

    console.log("📌 Creating Leads...");

    const leads = await Lead.insertMany([
      {
        owner: user._id,
        name: "Rahul Sharma",
        email: "rahul@techflow.io",
        phone: "9876543210",
        company: "TechFlow",
        status: "New",
        priority: "Medium",
        source: "Website",
        value: 25000,
        notes: "Downloaded pricing brochure.",
        tags: ["Website"],
        order: 0,
      },
      {
        owner: user._id,
        name: "Priya Singh",
        email: "priya@finedge.in",
        phone: "9876543211",
        company: "FinEdge",
        status: "Qualified",
        priority: "High",
        source: "Referral",
        value: 65000,
        notes: "Interested in enterprise plan.",
        tags: ["Enterprise"],
        order: 1,
      },
      {
        owner: user._id,
        name: "Arjun Mehta",
        email: "arjun@nextgen.ai",
        phone: "9876543212",
        company: "NextGen AI",
        status: "Proposal",
        priority: "High",
        source: "Cold Outreach",
        value: 90000,
        notes: "Proposal sent yesterday.",
        tags: ["Hot Lead"],
        order: 2,
      },
      {
        owner: user._id,
        name: "Sneha Kapoor",
        email: "sneha@visionsoft.com",
        phone: "9876543213",
        company: "VisionSoft",
        status: "Won",
        priority: "High",
        source: "Social",
        value: 120000,
        notes: "Deal successfully closed.",
        tags: ["Customer"],
        aiSummary: "High intent lead converted successfully.",
        aiRiskScore: 8,
        order: 3,
      },
      {
        owner: user._id,
        name: "Karan Patel",
        email: "karan@cloudlabs.io",
        phone: "9876543214",
        company: "CloudLabs",
        status: "Lost",
        priority: "Low",
        source: "Event",
        value: 40000,
        notes: "Budget constraints.",
        tags: ["Lost"],
        aiSummary: "Lost because of pricing concerns.",
        aiRiskScore: 92,
        order: 4,
      },
      {
        owner: user._id,
        name: "Neha Verma",
        email: "neha@pixelworks.in",
        phone: "9876543215",
        company: "PixelWorks",
        status: "Qualified",
        priority: "Medium",
        source: "Referral",
        value: 55000,
        notes: "Waiting for technical demo.",
        tags: ["Follow-up"],
        order: 5,
      },
    ]);

    console.log("✅ Leads created");
        console.log("👥 Creating Contacts...");

    const contacts = await Contact.insertMany([
      {
        owner: user._id,
        name: "Rahul Sharma",
        email: "rahul@techflow.io",
        phone: "9876543210",
        company: "TechFlow",
        title: "Founder",
        tags: ["Client", "Startup"],
        notes: "Primary decision maker.",
        favorite: true,
      },
      {
        owner: user._id,
        name: "Priya Singh",
        email: "priya@finedge.in",
        phone: "9876543211",
        company: "FinEdge",
        title: "Product Manager",
        tags: ["Enterprise"],
        notes: "Interested in automation features.",
        favorite: true,
      },
      {
        owner: user._id,
        name: "Arjun Mehta",
        email: "arjun@nextgen.ai",
        phone: "9876543212",
        company: "NextGen AI",
        title: "CTO",
        tags: ["AI"],
        notes: "Requested technical documentation.",
        favorite: false,
      },
      {
        owner: user._id,
        name: "Sneha Kapoor",
        email: "sneha@visionsoft.com",
        phone: "9876543213",
        company: "VisionSoft",
        title: "CEO",
        tags: ["Customer"],
        notes: "Existing customer.",
        favorite: true,
      },
      {
        owner: user._id,
        name: "Neha Verma",
        email: "neha@pixelworks.in",
        phone: "9876543215",
        company: "PixelWorks",
        title: "HR Manager",
        tags: ["Follow-up"],
        notes: "Scheduling next product demo.",
        favorite: false,
      },
      {
        owner: user._id,
        name: "Karan Patel",
        email: "karan@cloudlabs.io",
        phone: "9876543214",
        company: "CloudLabs",
        title: "Operations Head",
        tags: ["Lost"],
        notes: "May revisit next quarter.",
        favorite: false,
      },
    ]);

    console.log("✅ Contacts created");
        console.log("📝 Creating Notes...");

    await Note.insertMany([
      {
        owner: user._id,
        content: "Initial discovery call completed. Client is interested in CRM automation.",
        lead: leads[0]._id,
        contact: contacts[0]._id,
        pinned: true,
      },
      {
        owner: user._id,
        content: "Enterprise pricing shared. Waiting for internal approval.",
        lead: leads[1]._id,
        contact: contacts[1]._id,
        pinned: false,
      },
      {
        owner: user._id,
        content: "Technical demo scheduled for next Tuesday.",
        lead: leads[2]._id,
        contact: contacts[2]._id,
        pinned: true,
      },
      {
        owner: user._id,
        content: "Customer successfully onboarded and account activated.",
        lead: leads[3]._id,
        contact: contacts[3]._id,
        pinned: false,
      },
      {
        owner: user._id,
        content: "Lost due to pricing. Follow up again next quarter.",
        lead: leads[4]._id,
        contact: contacts[5]._id,
        pinned: false,
      },
    ]);

    console.log("✅ Notes created");

    console.log("📅 Creating Tasks...");

    const today = new Date();

    await Task.insertMany([
      {
        owner: user._id,
        title: "Call Rahul Sharma",
        description: "Discuss CRM requirements.",
        dueDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        status: "Pending",
        priority: "High",
        relatedLead: leads[0]._id,
        relatedContact: contacts[0]._id,
      },
      {
        owner: user._id,
        title: "Send Proposal",
        description: "Send enterprise proposal to Priya.",
        dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: "In Progress",
        priority: "High",
        relatedLead: leads[1]._id,
        relatedContact: contacts[1]._id,
      },
      {
        owner: user._id,
        title: "Technical Demo",
        description: "Conduct product demonstration.",
        dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: "Pending",
        priority: "Medium",
        relatedLead: leads[2]._id,
        relatedContact: contacts[2]._id,
      },
      {
        owner: user._id,
        title: "Customer Onboarding",
        description: "Complete onboarding checklist.",
        dueDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        status: "Completed",
        priority: "Medium",
        relatedLead: leads[3]._id,
        relatedContact: contacts[3]._id,
        completedAt: new Date(today.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        owner: user._id,
        title: "Re-engage Lost Lead",
        description: "Contact Karan after budget review.",
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        status: "Pending",
        priority: "Low",
        relatedLead: leads[4]._id,
        relatedContact: contacts[5]._id,
      },
      {
        owner: user._id,
        title: "Schedule Product Demo",
        description: "Book meeting with Neha.",
        dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        status: "Pending",
        priority: "Medium",
        relatedLead: leads[5]._id,
        relatedContact: contacts[4]._id,
      },
    ]);

    console.log("✅ Tasks created");
        console.log("");
    console.log("🎉 Database seeded successfully!");
    console.log("");
    console.log("========================================");
    console.log(" Login Credentials");
    console.log("========================================");
    console.log(`Email    : ${USER_EMAIL}`);
    console.log(`Password : ${USER_PASSWORD}`);
    console.log("========================================");
    console.log("");

    await mongoose.disconnect();
    console.log("📦 MongoDB disconnected");

    process.exit(0);
  } catch (err) {
    console.error("");
    console.error("❌ Seed failed");
    console.error(err);

    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();