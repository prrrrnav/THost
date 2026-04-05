"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react"
import { addPgRule, updatePgRule, deletePgRule } from "@/app/actions/settings"
import { toast } from "sonner"

interface Rule {
  id: string
  pg_id: string
  content: string
}

export function PgRulesManager({ pgId, pgName, initialRules }: { pgId: string, pgName: string, initialRules: Rule[] }) {
  const [newRule, setNewRule] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRule.trim()) return

    const formData = new FormData()
    formData.append("pgId", pgId)
    formData.append("content", newRule)

    try {
      setIsAdding(true)
      await addPgRule(formData)
      setNewRule("")
      toast.success("Rule added successfully")
    } catch (error) {
      toast.error("Failed to add rule")
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdate = async (ruleId: string) => {
    if (!editContent.trim()) return

    const formData = new FormData()
    formData.append("ruleId", ruleId)
    formData.append("content", editContent)

    try {
      setEditingId(null)
      await updatePgRule(formData)
      toast.success("Rule updated successfully")
    } catch (error) {
      toast.error("Failed to update rule")
    }
  }

  const handleDelete = async (ruleId: string) => {
    try {
      setIsDeleting(ruleId)
      await deletePgRule(ruleId)
      toast.success("Rule removed")
    } catch (error) {
      toast.error("Failed to delete rule")
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-black/20 p-5 hover:bg-black/40 transition-all duration-300">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-bold tracking-tight text-emerald-400">
          {pgName} Rules
        </Label>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{initialRules.length} Rules</span>
      </div>

      <div className="space-y-3">
        {initialRules.map((rule, index) => (
          <div 
            key={rule.id} 
            className="group relative flex items-start justify-between gap-3 rounded-lg border border-white/5 bg-zinc-900/40 p-3 transition-all hover:border-emerald-500/20 hover:bg-zinc-900/60"
          >
            <div className="flex flex-1 items-start gap-3">
              <span className="mt-0.5 text-xs font-bold text-zinc-600">{index + 1}.</span>
              {editingId === rule.id ? (
                <div className="flex flex-1 flex-col gap-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px] w-full rounded-md border border-emerald-500/30 bg-black/50 p-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdate(rule.id)}
                      className="h-7 bg-emerald-600 hover:bg-emerald-500 text-[10px]"
                    >
                      <Check className="mr-1 h-3 w-3" /> Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditingId(null)}
                      className="h-7 text-zinc-500 hover:text-zinc-300 text-[10px]"
                    >
                      <X className="mr-1 h-3 w-3" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400 leading-relaxed">{rule.content}</p>
              )}
            </div>

            {editingId !== rule.id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => { setEditingId(rule.id); setEditContent(rule.content) }}
                  className="h-8 w-8 text-zinc-500 hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={isDeleting === rule.id}
                  onClick={() => handleDelete(rule.id)}
                  className="h-8 w-8 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400"
                >
                  {isDeleting === rule.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            )}
          </div>
        ))}

        {initialRules.length === 0 && !isAdding && (
          <div className="py-4 text-center text-xs text-zinc-500 italic">No rules added yet.</div>
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-2 flex flex-col gap-3 pt-4 border-t border-white/5">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Add New Rule</Label>
        <div className="flex gap-2">
          <Input
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Enter a specific rule..."
            className="h-10 border-white/10 bg-black/40 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
          />
          <Button 
            type="submit" 
            disabled={isAdding || !newRule.trim()}
            className="h-10 bg-emerald-600 hover:bg-emerald-500"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}
