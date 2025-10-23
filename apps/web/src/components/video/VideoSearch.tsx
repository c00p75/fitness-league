import React, { useState, useMemo } from "react";
import { Search, Filter, X, Clock, Dumbbell, Target } from "lucide-react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@fitness-league/ui";
import { cn } from "@fitness-league/ui";

export interface VideoFilters {
  category?: string[];
  difficulty?: string[];
  equipment?: string[];
  duration?: { min: number; max: number };
  search?: string;
}

interface VideoSearchProps {
  onFilter: (filters: VideoFilters) => void;
  onSearch: (query: string) => void;
  filters: VideoFilters;
  className?: string;
}

const CATEGORIES = [
  { id: "cardio", label: "Cardio", icon: "🏃‍♀️" },
  { id: "strength", label: "Strength", icon: "💪" },
  { id: "hiit", label: "HIIT", icon: "⚡" },
  { id: "yoga", label: "Yoga", icon: "🧘‍♀️" },
  { id: "pilates", label: "Pilates", icon: "🤸‍♀️" },
  { id: "mobility", label: "Mobility", icon: "🔄" },
];

const DIFFICULTIES = [
  { id: "beginner", label: "Beginner", color: "bg-green-500" },
  { id: "intermediate", label: "Intermediate", color: "bg-yellow-500" },
  { id: "advanced", label: "Advanced", color: "bg-red-500" },
];

const EQUIPMENT = [
  { id: "none", label: "No Equipment", icon: "🏠" },
  { id: "dumbbells", label: "Dumbbells", icon: "🏋️‍♀️" },
  { id: "resistance_bands", label: "Resistance Bands", icon: "🎯" },
  { id: "yoga_mat", label: "Yoga Mat", icon: "🧘‍♀️" },
  { id: "pull_up_bar", label: "Pull-up Bar", icon: "🆙" },
  { id: "kettlebell", label: "Kettlebell", icon: "⚖️" },
  { id: "barbell", label: "Barbell", icon: "🏋️‍♂️" },
];

const DURATION_RANGES = [
  { id: "short", label: "5-15 min", min: 5, max: 15 },
  { id: "medium", label: "15-30 min", min: 15, max: 30 },
  { id: "long", label: "30+ min", min: 30, max: 180 },
];

export function VideoSearch({ onFilter, onSearch, filters, className }: VideoSearchProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<VideoFilters>(filters);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    onFilter({ ...localFilters, search: query });
  };

  const handleFilterChange = (key: keyof VideoFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: VideoFilters = {
      search: searchQuery,
      category: [],
      difficulty: [],
      equipment: [],
      duration: undefined,
    };
    setLocalFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (localFilters.category?.length) count++;
    if (localFilters.difficulty?.length) count++;
    if (localFilters.equipment?.length) count++;
    if (localFilters.duration) count++;
    return count;
  }, [localFilters]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search exercises and workouts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} className="text-sm">
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Categories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant={localFilters.category?.includes(category.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const current = localFilters.category || [];
                      const updated = current.includes(category.id)
                        ? current.filter(c => c !== category.id)
                        : [...current, category.id];
                      handleFilterChange("category", updated);
                    }}
                    className="justify-start"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Difficulty
              </h3>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((difficulty) => (
                  <Button
                    key={difficulty.id}
                    variant={localFilters.difficulty?.includes(difficulty.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const current = localFilters.difficulty || [];
                      const updated = current.includes(difficulty.id)
                        ? current.filter(d => d !== difficulty.id)
                        : [...current, difficulty.id];
                      handleFilterChange("difficulty", updated);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <div className={cn("w-2 h-2 rounded-full", difficulty.color)} />
                    <span>{difficulty.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Dumbbell className="w-4 h-4 mr-2" />
                Equipment
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {EQUIPMENT.map((equipment) => (
                  <Button
                    key={equipment.id}
                    variant={localFilters.equipment?.includes(equipment.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const current = localFilters.equipment || [];
                      const updated = current.includes(equipment.id)
                        ? current.filter(e => e !== equipment.id)
                        : [...current, equipment.id];
                      handleFilterChange("equipment", updated);
                    }}
                    className="justify-start"
                  >
                    <span className="mr-2">{equipment.icon}</span>
                    {equipment.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Duration
              </h3>
              <div className="flex flex-wrap gap-2">
                {DURATION_RANGES.map((range) => (
                  <Button
                    key={range.id}
                    variant={
                      localFilters.duration?.min === range.min && localFilters.duration?.max === range.max
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      const isSelected = localFilters.duration?.min === range.min && localFilters.duration?.max === range.max;
                      handleFilterChange("duration", isSelected ? undefined : { min: range.min, max: range.max });
                    }}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
