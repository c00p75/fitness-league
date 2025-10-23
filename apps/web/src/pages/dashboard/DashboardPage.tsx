import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Progress } from "@fitness-league/ui";
import { useAuth } from "../../hooks/useAuth";
import { trpc } from "../../lib/trpc";
import { Trophy, Target, Calendar, TrendingUp, Plus, Play, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch user goals
  const { data: goals = [], isLoading: goalsLoading } = trpc.goals.getGoals.useQuery(undefined);
  
  // Fetch recent workout plans
  const { data: recentPlans = [] } = trpc.workouts.getPlans.useQuery({ limit: 3 });

  const activeGoals = goals.filter((goal: any) => goal.isActive !== false);
  const completedGoals = goals.filter((goal: any) => (goal.currentValue || 0) >= (goal.targetValue || 0));
  const upcomingDeadlines = goals.filter((goal: any) => {
    const targetDate = goal.targetDate?.toDate ? goal.targetDate.toDate() : new Date(goal.targetDate);
    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return targetDate <= oneMonthFromNow && (goal.currentValue || 0) < (goal.targetValue || 0);
  });

  const getGoalTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      weight_loss: "🔥",
      muscle_gain: "💪",
      flexibility: "🧘",
      general_fitness: "🏃",
      endurance_improvement: "⚡",
      strength_gain: "🏋️",
    };
    return icons[type] || "🎯";
  };

  const getGoalTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      weight_loss: "Weight Loss",
      muscle_gain: "Muscle Gain",
      flexibility: "Flexibility",
      general_fitness: "General Fitness",
      endurance_improvement: "Endurance",
      strength_gain: "Strength Gain",
    };
    return labels[type] || type;
  };

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
              Active Goals
            </CardTitle>
            <Target className="h-4 w-4 text-fitness-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeGoals.length}</div>
            <p className="text-xs text-white/60">
              Currently tracking
            </p>
          </CardContent>
        </Card>

        <Card className="fitness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Completed Goals
            </CardTitle>
            <Trophy className="h-4 w-4 text-fitness-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedGoals.length}</div>
            <p className="text-xs text-white/60">
              Goals achieved
            </p>
          </CardContent>
        </Card>

        <Card className="fitness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Upcoming Deadlines
            </CardTitle>
            <Calendar className="h-4 w-4 text-fitness-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{upcomingDeadlines.length}</div>
            <p className="text-xs text-white/60">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="fitness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Workout Plans
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-fitness-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{recentPlans.length}</div>
            <p className="text-xs text-white/60">
              Available plans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Overview */}
      {activeGoals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Your Active Goals</CardTitle>
              <CardDescription>
                Track your progress and stay motivated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeGoals.slice(0, 3).map((goal: any) => {
                  const progress = Math.min((goal.currentValue || 0) / (goal.targetValue || 1)) * 100;
                  return (
                    <div key={goal.id} className="flex items-center space-x-4 p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="text-2xl">{getGoalTypeIcon(goal.type)}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{getGoalTypeLabel(goal.type)}</h4>
                        <p className="text-sm text-white/70">
                          {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                        </p>
                        <Progress value={progress} className="mt-2 h-2" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/goals')}
                        className="text-fitness-primary hover:text-fitness-primary/80"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
                {activeGoals.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/goals')}
                  >
                    View All Goals ({activeGoals.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Quick Start Workouts</CardTitle>
              <CardDescription>
                Jump into your fitness routine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPlans.slice(0, 2).map((plan: any) => (
                  <div key={plan.id} className="flex items-center space-x-4 p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 bg-fitness-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💪</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{plan.name}</h4>
                      <p className="text-sm text-white/70">
                        {plan.duration} min • {plan.difficulty}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/goals')}
                      className="text-fitness-primary hover:text-fitness-primary/80"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/goals')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Goals State */}
      {activeGoals.length === 0 && !goalsLoading && (
        <Card className="fitness-card">
          <CardContent className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-fitness-primary/10 rounded-full flex items-center justify-center">
              <Target className="w-12 h-12 text-fitness-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Ready to Start Your Fitness Journey?
            </h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Create your first fitness goal to start tracking your progress and stay motivated on your journey.
            </p>
            <Button
              onClick={() => navigate('/goals')}
              className="bg-fitness-primary hover:bg-fitness-primary/90 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

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
            <button 
              onClick={() => navigate('/goals')}
              className="p-4 border border-white/20 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-white">View Goals</h3>
              <p className="text-sm text-white/70">Track your progress</p>
            </button>
            <button 
              onClick={() => navigate('/goals')}
              className="p-4 border border-white/20 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <div className="text-2xl mb-2">💪</div>
              <h3 className="font-semibold text-white">Start Workout</h3>
              <p className="text-sm text-white/70">Begin your routine</p>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="p-4 border border-white/20 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <div className="text-2xl mb-2">👤</div>
              <h3 className="font-semibold text-white">Update Profile</h3>
              <p className="text-sm text-white/70">Manage your settings</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
