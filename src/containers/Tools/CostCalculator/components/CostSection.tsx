import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CostItem } from "./ICalculator";

interface CostSectionProps {
  title: string;
  items: Record<string, CostItem>;
  onItemChange: (key: string, updates: Partial<CostItem>) => void;
  showSubtotal?: boolean;
  subtotal?: number;
}

export function CostSection({
  title,
  items,
  onItemChange,
  showSubtotal,
  subtotal,
}: CostSectionProps) {
  return (
    <Card className="bg-emerald-100">
      <CardHeader>
        <CardTitle className="text-sky-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sky-900">
        {Object.entries(items).map(([key, item]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-4">
              <Checkbox
                className=""
                checked={item.enabled !== false}
                onCheckedChange={(checked) =>
                  onItemChange(key, { enabled: checked as boolean })
                }
              />
              <Label>{item.name}</Label>
            </div>
            {item.enabled !== false && (
              <div className="flex items-center gap-2 ml-6">
                <span>$</span>
                <Input
                  type="number"
                  value={item.amount}
                  onChange={(e) =>
                    onItemChange(key, { amount: Number(e.target.value) })
                  }
                  className="w-48 border-2 border-sky-800"
                />
                {item.months !== undefined && (
                  <>
                    <span>/m x</span>
                    <Input
                      type="number"
                      value={item.months}
                      onChange={(e) =>
                        onItemChange(key, { months: Number(e.target.value) })
                      }
                      className="w-48 border-2 border-sky-800"
                    />
                    <span>months</span>
                  </>
                )}
                {key === "diapers" && (
                  <Select
                    value={item.amount.toString()}
                    onValueChange={(value) =>
                      onItemChange(key, { amount: Number(value) })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select diaper type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="76">
                        Disposable diapers ($76)
                      </SelectItem>
                      <SelectItem value="50">Cloth diapers ($50)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>
        ))}
        {showSubtotal && (
          <div className="text-right font-medium">
            Subtotal of {title}: ${subtotal?.toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
