import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const SYSTEM_PROMPT = `You write short, plain-English performance trend summaries for an employee
viewing their own review history. Given up to three months of scores (Output Quality, Attendance,
Teamwork, each 1-5) and the manager's comments, write 3-5 sentences in second person ("you") that:
name the specific dimension driving any improvement or decline, mention one concrete strength and,
if relevant, one area to focus on — grounded only in the data given, never invented. If there is
only one review, describe it honestly instead of claiming a trend. Plain prose only, no markdown,
no lists, no headers.`;

export async function POST(req) {
  try {
    const { reviews, employeeName } = await req.json();

    if (!reviews || reviews.length === 0) {
      return Response.json({
        summary: "No reviews yet — once a monthly check-in is submitted, a trend summary will appear here.",
      });
    }

    const sorted = [...reviews].sort((a, b) => String(a.month).localeCompare(String(b.month)));
    const recent = sorted.slice(-3);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 250,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Employee: ${employeeName || "this employee"}
Reviews (oldest to newest, most recent ${recent.length} of ${sorted.length} total):
${JSON.stringify(recent)}`,
        },
      ],
    });

    const summary = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return Response.json({ summary });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to generate summary." }, { status: 500 });
  }
}