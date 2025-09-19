import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionEditorProps {
  description: string;
  descriptionTab: "edit" | "preview";
  onDescriptionChange: (description: string) => void;
  onTabChange: (tab: "edit" | "preview") => void;
}

export function DescriptionEditor({
  description,
  descriptionTab,
  onDescriptionChange,
  onTabChange,
}: DescriptionEditorProps) {
  const renderMarkdown = (text: string) => {
    return text
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-2xl font-bold mb-4 text-foreground">$1</h1>',
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-xl font-semibold mb-3 text-foreground">$1</h2>',
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-medium mb-2 text-foreground">$1</h3>',
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-foreground">$1</strong>',
      )
      .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 text-muted-foreground">• $1</li>')
      .replace(
        /\n\n/g,
        '</p><p class="mb-4 text-muted-foreground leading-relaxed">',
      )
      .replace(
        /^(.+)$/gm,
        '<p class="mb-4 text-muted-foreground leading-relaxed">$1</p>',
      );
  };

  return (
    <Tabs
      value={descriptionTab}
      onValueChange={(v) => onTabChange(v as "edit" | "preview")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="edit">Edit Description</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="mt-4">
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Product Description (Markdown supported)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter product description using markdown..."
            className="min-h-[300px] resize-none"
          />
          <p className="text-sm text-muted-foreground">
            You can use markdown formatting: **bold**, *italic*, # headings, -
            bullet points
          </p>
        </div>
      </TabsContent>

      <TabsContent value="preview" className="mt-4">
        <div className="min-h-[300px] border rounded-lg p-4 bg-background">
          {description ? (
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert text-foreground"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(description),
              }}
            />
          ) : (
            <p className="text-muted-foreground italic">
              Description preview will appear here...
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
