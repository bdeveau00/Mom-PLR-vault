export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-green-light py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-lavender/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-brand-lavender/30 relative z-10">
        {children}
      </div>
    </div>
  )
}
