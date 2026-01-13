// "use client";

// import { useEffect, useState } from "react";
// import { Shield, LogOut, CheckCircle } from "lucide-react";
// import { useRouter } from "next/navigation";

// /**
//  * Protected Dashboard Page
//  * 
//  * Security:
//  * - Only accessible with valid JWT cookie (verified by middleware)
//  * - Unauthenticated users are automatically redirected to /
//  * - Logout clears the auth cookie
//  */
// export default function Dashboard() {
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       // Call logout API to clear cookie server-side
//       await fetch("/api/logout", { method: "POST" });
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
    
//     // Redirect to home
//     router.push("/");
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       {/* Header */}
//       <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
//         <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="rounded-lg bg-gray-900 p-2">
//                 <Shield className="h-5 w-5 text-white" />
//               </div>
//               <h1 className="text-xl font-bold text-gray-900">Private Dashboard</h1>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
//             >
//               <LogOut className="h-4 w-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
//           {/* Success indicator */}
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-full bg-green-100 p-2">
//               <CheckCircle className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Authentication Successful
//               </h2>
//               <p className="text-sm text-gray-600">
//                 You have access to the private dashboard
//               </p>
//             </div>
//           </div>

//           {/* Dashboard content */}
//           <div className="space-y-6">
//             <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
//               <h3 className="mb-2 text-base font-semibold text-gray-900">
//                 Welcome to your private dashboard
//               </h3>
//               <p className="text-sm text-gray-600">
//                 This is a protected area. Only authenticated users can access this page.
//               </p>
//             </div>

//             {/* Security info */}
//             <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
//               <h3 className="mb-2 text-base font-semibold text-blue-900">
//                 Security Features
//               </h3>
//               <ul className="space-y-1 text-sm text-blue-800">
//                 <li>• JWT-based authentication with httpOnly cookies</li>
//                 <li>• Middleware route protection</li>
//                 <li>• Secure cookie flags (sameSite, secure)</li>
//                 <li>• Password never exposed in URL or frontend</li>
//               </ul>
//             </div>

//             {/* Placeholder for your actual dashboard content */}
//             <div className="rounded-lg border border-gray-200 bg-white p-6">
//               <h3 className="mb-4 text-base font-semibold text-gray-900">
//                 Your Dashboard Content
//               </h3>
//               <p className="text-sm text-gray-600">
//                 Add your private dashboard content here. This could include:
//               </p>
//               <ul className="mt-3 space-y-2 text-sm text-gray-600">
//                 <li className="flex items-start gap-2">
//                   <span className="text-gray-400">•</span>
//                   <span>Analytics and metrics</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-gray-400">•</span>
//                   <span>Private data and reports</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-gray-400">•</span>
//                   <span>Internal tools and utilities</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

