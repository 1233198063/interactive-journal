import type { FortuneUnlockRule, Journal } from "../journal/types";
import type { FortuneState } from "./fortuneStorage";

/** Whether a hidden stick's unlock condition currently holds, given the device clock. */
export function isHiddenEligible(
  rule: FortuneUnlockRule,
  now: Date,
  journal: Journal,
  state: FortuneState
): boolean {
  switch (rule.kind) {
    case "birthday": {
      if (!journal.recipientBirthday) return false;
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      return `${mm}-${dd}` === journal.recipientBirthday;
    }
    case "night": {
      const hour = now.getHours();
      // The window may wrap past midnight (e.g. 21 -> 6).
      return rule.startHour > rule.endHour
        ? hour >= rule.startHour || hour < rule.endHour
        : hour >= rule.startHour && hour < rule.endHour;
    }
    case "streak":
      return state.streak >= rule.days;
  }
}
