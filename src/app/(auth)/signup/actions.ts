// "use server";

// import bcrypt from "bcryptjs";
// import { db } from "@/lib/db";
// import { redirect } from "next/navigation";
// import { signupSchema } from "@/lib/validations/auth";

// export async function registerUser(formData: FormData) {
//   const rawData = {
//     name: formData.get("name"),
//     email: formData.get("email"),
//     password: formData.get("password"),
//   };

//   const parsed = signupSchema.safeParse(rawData);

//   if (!parsed.success) {
//     return {
//       error: "Please enter valid information.",
//     };
//   }

//   const { name, email, password } = parsed.data;

//   const existingUser = await db.user.findUnique({
//     where: {
//       email,
//     },
//   });

//   if (existingUser) {
//     return {
//       error: "An account with this email already exists.",
//     };
//   }

//   const passwordHash = await bcrypt.hash(password, 12);

//   await db.user.create({
//     data: {
//       name,
//       email,
//       passwordHash,
//       onboardingDone: false,
//     },
//   });

//   redirect("/login?registered=true");
// }