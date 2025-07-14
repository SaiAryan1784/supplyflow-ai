"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { FORECAST_MODELS } from "@/hooks/useForecasting";
import { RoutingAlgorithm } from "@/hooks/useRouting";
import {
  Brain,
  Settings,
  Calendar,
  Target,
  Zap,
  Loader2,
} from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  timeHorizon: number;
  onTimeHorizonChange: (days: number) => void;
  confidenceLevel: number;
  onConfidenceLevelChange: (level: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  timeHorizon,
  onTimeHorizonChange,
  confidenceLevel,
  onConfidenceLevelChange,
  onGenerate,
  isGenerating,
}: ModelSelectorProps) {
  const selectedModelInfo = FORECAST_MODELS.find(m => m.id === selectedModel);

  const timeHorizonOptions = [
    { value: 30, label: "30 Days" },
    { value: 60, label: "60 Days" },
    { value: 90, label: "90 Days" },
    { value: 180, label: "6 Months" },
    { value: 365, label: "1 Year" },
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-supply-primary" />
          Model Configuration
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure forecasting parameters and model selection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Forecasting Model
          </label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {FORECAST_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.accuracy}% accuracy
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Model Info */}
          {selectedModelInfo && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {selectedModelInfo.name}
                </span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {selectedModelInfo.accuracy}% accuracy
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      selectedModelInfo.complexity === 'high' ? 'text-supply-warning' :
                      selectedModelInfo.complexity === 'medium' ? 'text-supply-info' :
                      'text-supply-success'
                    }`}
                  >
                    {selectedModelInfo.complexity} complexity
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {selectedModelInfo.description}
              </p>
              <div className="text-xs">
                <span className="text-muted-foreground">Best for: </span>
                <span className="text-foreground">
                  {selectedModelInfo.bestFor.join(", ")}
                </span>
              </div>
              <div className="text-xs mt-1">
                <span className="text-muted-foreground">Training time: </span>
                <span className="text-foreground">
                  ~{selectedModelInfo.trainingTime}s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Time Horizon */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-supply-secondary" />
            Forecast Horizon
          </label>
          <Select 
            value={timeHorizon.toString()} 
            onValueChange={(value) => onTimeHorizonChange(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time horizon" />
            </SelectTrigger>
            <SelectContent>
              {timeHorizonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-xs text-muted-foreground">
            Longer horizons may have reduced accuracy
          </div>
        </div>

        {/* Confidence Level */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-supply-info" />
            Confidence Level: {confidenceLevel}%
          </label>
          <Slider
            value={[confidenceLevel]}
            onValueChange={(value) => onConfidenceLevelChange(value[0])}
            min={80}
            max={99}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>80% (Wider bands)</span>
            <span>99% (Narrower bands)</span>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            Advanced Settings
          </label>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <span className="text-xs text-foreground">Seasonal Adjustment</span>
              <Badge variant="outline" className="text-xs">
                Auto
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <span className="text-xs text-foreground">Trend Detection</span>
              <Badge variant="outline" className="text-xs">
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <span className="text-xs text-foreground">Outlier Handling</span>
              <Badge variant="outline" className="text-xs">
                Robust
              </Badge>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full bg-supply-primary hover:bg-supply-primary/90"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Forecast...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Forecast
            </>
          )}
        </Button>

        {/* Model Comparison */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Model Comparison
          </label>
          <div className="space-y-2">
            {FORECAST_MODELS.slice(0, 3).map((model) => (
              <div
                key={model.id}
                className={`p-2 rounded border cursor-pointer transition-all ${
                  model.id === selectedModel
                    ? "border-supply-primary bg-supply-primary/5"
                    : "border-border bg-muted/20"
                }`}
                onClick={() => onModelChange(model.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    {model.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {model.accuracy}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1 mt-1">
                  <div
                    className="bg-supply-primary h-1 rounded-full transition-all"
                    style={{ width: `${model.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Tip */}
        <div className="p-3 bg-supply-info/10 border border-supply-info/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-supply-info" />
            <span className="text-sm font-medium text-supply-info">
              Performance Tip
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ensemble models provide the highest accuracy but take longer to train. 
            Use Prophet for seasonal data or LSTM for complex patterns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}