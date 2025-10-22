import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@fitness-league/ui";
import { useAuth } from "../../hooks/useAuth";
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.displayName || "Fitness Enthusiast"}! 👋
        </h1>
        <p className="text-white/70">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="fitness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Workouts This Week
            </CardTitle>
            <Calendar className="h-4 w-4 text-fitness-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-white/60">
              +1 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="fitness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Current Streak
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-fitness-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5 days</div>
            <p className="text-xs text-white/60">
              Keep it up! 🔥
            </p>
          </CardContent>
        </Card>

        <Card className="fitness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Calories Burned
            </CardTitle>
            <Target className="h-4 w-4 text-fitness-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,240</div>
            <p className="text-xs text-white/60">
              This week
            </p>
          </CardContent>
        </Card>

        <Card className="fitness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Badges Earned
            </CardTitle>
            <Trophy className="h-4 w-4 text-fitness-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-white/60">
              Total badges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Workout */}
        <div className="lg:col-span-2">
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Today's Recommended Workout</CardTitle>
              <CardDescription>
                Based on your goals and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-fitness-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💪</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Upper Body Strength</h3>
                    <p className="text-sm text-white/70">45 minutes • Intermediate</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="fitness">Strength</Badge>
                      <Badge variant="secondary">Dumbbells</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/70">
                  A comprehensive upper body workout focusing on chest, back, shoulders, and arms. 
                  Perfect for building strength and muscle definition.
                </p>
                <div className="flex space-x-3">
                  <button className="fitness-button flex-1">
                    Start Workout
                  </button>
                  <button className="px-4 py-2 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest workouts and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-fitness-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">🏃‍♂️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Morning Run</p>
                    <p className="text-xs text-white/60">2 days ago • 30 min</p>
                  </div>
                  <Badge variant="fitness">Completed</Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-fitness-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">🏋️‍♀️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Strength Training</p>
                    <p className="text-xs text-white/60">3 days ago • 45 min</p>
                  </div>
                  <Badge variant="fitness">Completed</Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-fitness-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">🧘‍♀️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Yoga Flow</p>
                    <p className="text-xs text-white/60">5 days ago • 20 min</p>
                  </div>
                  <Badge variant="fitness">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="fitness-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump into your fitness routine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-white/20 rounded-xl hover:bg-white/5 transition-colors text-left">
              <div className="text-2xl mb-2">🏃‍♂️</div>
              <h3 className="font-semibold text-white">Start Cardio</h3>
              <p className="text-sm text-white/70">Quick cardio session</p>
            </button>
            <button className="p-4 border border-white/20 rounded-xl hover:bg-white/5 transition-colors text-left">
              <div className="text-2xl mb-2">💪</div>
              <h3 className="font-semibold text-white">Strength Training</h3>
              <p className="text-sm text-white/70">Build muscle and strength</p>
            </button>
            <button className="p-4 border border-white/20 rounded-xl hover:bg-white/5 transition-colors text-left">
              <div className="text-2xl mb-2">🧘‍♀️</div>
              <h3 className="font-semibold text-white">Yoga & Stretch</h3>
              <p className="text-sm text-white/70">Flexibility and mindfulness</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
