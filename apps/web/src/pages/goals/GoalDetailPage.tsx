import { useParams, useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Progress, Badge } from "@fitness-league/ui";
import { ArrowLeft, Target, Calendar, TrendingUp, Plus, Play, Eye } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function GoalDetailPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();

  // Fetch goal details
  const { data: goal, isLoading: goalLoading } = trpc.goals.getGoal.useQuery(
    { goalId: goalId! },
    { enabled: !!goalId }
  );

  // Fetch workouts for this goal
  const { data: workouts = [], isLoading: workoutsLoading } = trpc.workouts.getPlans.useQuery(
    { goalId: goalId! },
    { enabled: !!goalId }
  );

  if (goalLoading) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-fitness-foreground mb-4">Goal Not Found</h2>
          <p className="text-fitness-muted-foreground mb-6">The goal you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/goals")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Goals
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = goal.currentValue 
    ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
    : 0;

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

  const getGoalTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      weight_loss: "bg-red-100 text-red-800",
      muscle_gain: "bg-blue-100 text-blue-800",
      flexibility: "bg-green-100 text-green-800",
      general_fitness: "bg-purple-100 text-purple-800",
      endurance_improvement: "bg-orange-100 text-orange-800",
      strength_gain: "bg-yellow-100 text-yellow-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: any) => {
    // Handle Firestore Timestamp or Date objects
    let dateObj: Date;
    if (date && typeof date.toDate === 'function') {
      // Firestore Timestamp
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      // Already a Date object
      dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      // String or number timestamp
      dateObj = new Date(date);
    } else {
      // Fallback
      dateObj = new Date();
    }
    
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = () => {
    // Handle Firestore Timestamp or Date objects
    let targetDate: Date;
    if (goal.targetDate && typeof goal.targetDate.toDate === 'function') {
      // Firestore Timestamp
      targetDate = goal.targetDate.toDate();
    } else if (goal.targetDate instanceof Date) {
      // Already a Date object
      targetDate = goal.targetDate;
    } else {
      // String or number timestamp
      targetDate = new Date(goal.targetDate);
    }
    
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/goals")}
            className="text-fitness-muted-foreground hover:text-fitness-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Goals
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground">{getGoalTypeLabel(goal.type)}</h1>
            <p className="text-fitness-muted-foreground">Track your progress and manage workouts</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getGoalTypeColor(goal.type)}>
            {getGoalTypeLabel(goal.type)}
          </Badge>
        </div>
      </div>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Goal Progress</span>
          </CardTitle>
          <CardDescription>
            {goal.currentValue} {goal.unit} of {goal.targetValue} {goal.unit}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-fitness-muted-foreground">
              <span>{progressPercentage.toFixed(1)}% complete</span>
              <span>{getDaysRemaining()} days remaining</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Target: {formatDate(goal.targetDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Progress: {goal.currentValue || 0} {goal.unit}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workouts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-fitness-foreground">Workout Plans</h2>
          <Button
            onClick={() => navigate(`/goals/${goalId}/workouts`)}
            className="bg-fitness-primary hover:bg-fitness-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {workoutsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : workouts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-fitness-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-fitness-primary" />
              </div>
              <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                No workout plans yet
              </h3>
              <p className="text-fitness-muted-foreground mb-6">
                Create your first workout plan to start working towards this goal.
              </p>
              <Button
                onClick={() => navigate(`/goals/${goalId}/workouts`)}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout: any) => (
              <Card key={workout.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{workout.name}</CardTitle>
                  <CardDescription>{workout.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-fitness-muted-foreground">Duration</span>
                      <span>{workout.durationWeeks} weeks</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-fitness-muted-foreground">Frequency</span>
                      <span>{workout.workoutsPerWeek} sessions/week</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-fitness-muted-foreground">Difficulty</span>
                      <Badge variant="secondary">{workout.difficulty}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-fitness-muted-foreground">Exercises</span>
                      <span>{workout.exercises?.length || 0} exercises</span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/goals/${goalId}/workouts/${workout.id}`)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/goals/${goalId}/workouts/${workout.id}`)}
                        className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
