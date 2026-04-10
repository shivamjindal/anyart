import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { IdeaForm } from "@/components/idea-form"

describe("IdeaForm", () => {
  it("submits raw idea and calls onCreated", async () => {
    const user = userEvent.setup()
    const onCreated = jest.fn()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: "1",
          rawInput: "dark mode",
          title: "Dark mode",
          description: "Desc",
          votes: 0,
          status: "submitted",
          jiraKey: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          canEdit: true,
          hasVoted: false,
        },
      }),
    })

    render(<IdeaForm onCreated={onCreated} />)
    await user.type(screen.getByPlaceholderText(/dark mode/i), "dark mode")
    await user.click(screen.getByRole("button", { name: /submit/i }))

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/ideas",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ rawInput: "dark mode" }),
      }),
    )
    expect(onCreated).toHaveBeenCalled()
  })
})
