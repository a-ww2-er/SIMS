import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80">
      <div className="min-h-screen flex">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
          <div className="absolute inset-0 bg-black/20" />

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/50 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              {/* <div className="p-3 bg-primary rounded-xl"> */}
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png" alt="Logo" className="w-12 h-12" />
              {/* </div> */}
              <h1 className="text-3xl font-bold text-white">EduCare SIMS</h1>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 text-balance leading-tight">
              {"Access record more "}
              <span className="italic font-serif">Easily</span>
            </h2>

            <p className="text-xl text-white/90 mb-8 text-pretty leading-relaxed">
              Empowering educational excellence through comprehensive student information management. Your education,
              your future.
            </p>

            <div className="space-y-4">
              <div className="text-white/80 text-lg font-medium">Trusted by 500+ educational institutions</div>
              <div className="flex items-center gap-6 text-white/70">
                <div className="text-center">
                  <div className="text-2xl font-bold">2,847</div>
                  <div className="text-sm">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm">Faculty Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">342</div>
                  <div className="text-sm">Courses</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white/5 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        {/* Mobile Hero Content */}
        <div className="lg:hidden absolute top-6 left-6 right-6 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png" alt="Logo" className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white">EduCare SIMS</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
