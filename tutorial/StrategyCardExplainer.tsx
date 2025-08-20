import React, { useState } from 'react';
import { useStrategyCardByName } from '@/hooks/useStrategyCardByName';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  strategy_name: string;
  content: string;
  visual?: string;
  win_example?: string;
  lose_example?: string;
}

export default function StrategyCardExplainer(props: Props) {
  const { strategy_name, content, visual, win_example, lose_example } = props;
  const { card, loading } = useStrategyCardByName(strategy_name);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{strategy_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center gap-4">
            <Skeleton className="h-40 w-32 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        )}
        
        {card && !loading && (
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="relative group mx-auto lg:mx-0 flex-shrink-0">
              {card.front_image_url && (
                <div 
                  className="relative h-64 w-48 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  onMouseEnter={() => setIsCardFlipped(true)}
                  onMouseLeave={() => setIsCardFlipped(false)}
                >
                  <img
                    src={isCardFlipped && card.back_image_url ? card.back_image_url : card.front_image_url}
                    alt={`${strategy_name} strategy card ${isCardFlipped ? 'back' : 'front'}`}
                    className="h-full w-full rounded-md object-cover transition-all duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
                </div>
              )}
              {!card.front_image_url && visual && (
                <img
                  src={visual}
                  alt={`${strategy_name} visual`}
                  className="h-40 w-32 rounded-md object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{content}</p>
              {card.description && (
                <div className="mt-2 p-2 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {!card && <p className="text-sm leading-relaxed">{content}</p>}

        {(win_example || lose_example) && (
          <div className="grid sm:grid-cols-2 gap-3">
            {win_example && (
              <div className="rounded-md border p-3">
                <div className="text-sm font-medium">Win example</div>
                <div className="text-sm opacity-80">{win_example}</div>
              </div>
            )}
            {lose_example && (
              <div className="rounded-md border p-3">
                <div className="text-sm font-medium">Lose example</div>
                <div className="text-sm opacity-80">{lose_example}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
