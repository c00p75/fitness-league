import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Progress } from "@fitness-league/ui";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getGoals } from "../../services/firestore/goalsService";
import { getProfile } from "../../services/firestore/userService";
import { getPlans } from "../../services/firestore/workoutsService";
import { Trophy, Target, Calendar, TrendingUp, Plus, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch user goals
  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  });
  
  // Fetch user profile to get gender for image selection
  const { data: profile } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getProfile,
  });
  
  // Fetch recent workout plans
  const { data: allPlans = [] } = useQuery({
    queryKey: ['workouts', 'plans'],
    queryFn: async () => getPlans(),
  });
  const recentPlans = allPlans.slice(0, 3);

  // Carousel state for multiple goals
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  // Get user gender from profile data
  const getUserGender = () => {
    return profile?.biometrics?.gender || 'male'; // Default to male if not available
  };

  // Resolve preferred display name from profile or auth
  const resolvedDisplayName = (() => {
    const fromProfile = (profile as any)?.displayName;
    const fromAuth = user?.displayName;
    const name = (fromProfile || fromAuth || '').trim();
    return name.length > 0 ? name : null;
  })();

  // Map goal types to image names
  const getGoalImagePath = (goalType: string) => {
    const gender = getUserGender();
    const imageMap: Record<string, string> = {
      weight_loss: 'weight_loss',
      muscle_gain: 'gain_muscle',
      flexibility: 'flexibility',
      general_fitness: 'general_fitness',
      endurance_improvement: 'endurance',
      strength_gain: 'strength',
    };
    
    const imageName = imageMap[goalType] || 'general_fitness';
    return `/images/dashboard/${imageName}_${gender}.jpg`;
  };

  // Map workout plans to appropriate background images
  const getWorkoutImagePath = (plan: any) => {
    const gender = getUserGender();
    
    // Map workout goal types to image names
    const imageMap: Record<string, string> = {
      weight_loss: 'weight_loss',
      muscle_gain: 'gain_muscle',
      flexibility: 'flexibility',
      general_fitness: 'general_fitness',
      endurance_improvement: 'endurance',
      strength_gain: 'strength',
    };
    
    // Find the goal type from the active goals using plan.goalId
    let goalType = 'general_fitness'; // Default fallback
    
    if (plan.goalId && activeGoals.length > 0) {
      const relatedGoal = activeGoals.find((goal: any) => goal.id === plan.goalId);
      if (relatedGoal && (relatedGoal as any).type) {
        goalType = (relatedGoal as any).type;
      }
    }
    
        const imageName = imageMap[goalType] || 'general_fitness';
        return `/images/workouts/${imageName}_${gender}.jpg`;
  };

  // Carousel effect for multiple goals
  useEffect(() => {
    if (activeGoals.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentGoalIndex((prev) => (prev + 1) % activeGoals.length);
        setIsTransitioning(false);
      }, 500); // Half of transition duration
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [activeGoals.length]);

  // Get current goal for background
  const getCurrentGoal = () => {
    if (activeGoals.length === 0) return null;
    return activeGoals[currentGoalIndex] || activeGoals[0];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {resolvedDisplayName || "Fitness Enthusiast"}! 👋
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
          <Card 
            className={`fitness-card relative overflow-hidden animated-bg transition-opacity duration-1000 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}
            style={{
              backgroundImage: `url(${getGoalImagePath((getCurrentGoal() as any)?.type || 'general_fitness')})`,
              backgroundSize: '120% auto',
              backgroundPosition: '100% 50%',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            
            {/* Content */}
            <div className="relative z-10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Your Active Goals</CardTitle>
                    <CardDescription className="text-white/80">
                      Track your progress and stay motivated
                    </CardDescription>
                  </div>
                  {activeGoals.length > 1 && (
                    <div className="flex space-x-1">
                      {activeGoals.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentGoalIndex 
                              ? 'bg-fitness-primary scale-125' 
                              : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeGoals.slice(0, 3).map((goal: any) => {
                    const progress = Math.min((goal.currentValue || 0) / (goal.targetValue || 1)) * 100;
                    return (
                      <div
                        key={goal.id} 
                        className="flex items-center space-x-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                        onClick={() => navigate(`/goals/${goal.id}`)}
                      >
                        <div className="text-2xl">{getGoalTypeIcon(goal.type)}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{getGoalTypeLabel(goal.type)}</h4>
                          <p className="text-sm text-white/90">
                            {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                          </p>
                          <Progress value={progress} className="mt-2 h-2" />
                        </div>
                      </div>
                    );
                  })}
                  {activeGoals.length > 3 && (
                    <Button
                      variant="outline"
                      className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={() => navigate('/goals')}
                    >
                      View All Goals ({activeGoals.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Quick Start Workouts</CardTitle>
              <CardDescription>
                Jump into your fitness routine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {recentPlans.length > 0 ? recentPlans.slice(0, 2).map((plan: any) => (
                  <div 
                    key={plan.id}
                    className="relative h-32 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      backgroundImage: `url(${getWorkoutImagePath(plan)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#1a1a2e' // Fallback color
                    }}
                    onClick={() => {
                      if (plan.goalId) {
                        navigate(`/goals/${plan.goalId}/workouts/${plan.id}/session`);
                      } else {
                        navigate('/goals');
                      }
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80 group-hover:from-black/85 group-hover:via-black/75 group-hover:to-black/65 transition-all duration-300" />
                    
                    {/* Content with glass effect */}
                    <div className="relative z-10 h-full flex items-center justify-between p-4">
                      <div className="backdrop-blur-sm rounded-lg p-3">
                        <h4 className="font-semibold text-white text-lg">{plan.name}</h4>
                        <p className="text-sm text-white/90">
                          {plan.duration} min • {plan.difficulty}
                        </p>
                      </div>
                      
                      {/* Play button */}
                      <div className="w-10 h-10 rounded-full bg-fitness-primary flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-fitness-primary/50 transition-all duration-300">
                        <Play className="w-5 h-5 text-black" />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-white/70 mb-4">No workout plans available</p>
                    <p className="text-sm text-white/50">Create a goal to generate workout plans</p>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300"
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
