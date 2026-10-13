---
name: rebody-find-a-treatment
description: >
  Take a person from a wellness goal or a named treatment to a Rebody visit
  link: match the goal, compare formats and plans, then mint the link. Use when
  someone asks what could help with sleep, energy, focus, recovery, skin, hair,
  desire, or strength, asks to compare Rebody formats or plans, or asks to
  start a Rebody visit.
---

# Find a Rebody treatment

Read the `rebody` skill first for the tools, prices, and boundaries.

## Steps

1. **Goal or name.** If the person names a compound or format, call
   `get_treatment`. If they describe a goal, pick one key and call
   `find_options_for_goal`:

   | They say | `goal` |
   | --- | --- |
   | energy, focus, brain fog | `energy_focus` |
   | sleep, waking tired | `sleep_morning` |
   | strength, drive | `strength_drive` |
   | recovery, training, soreness | `training_recovery` |
   | skin, hair, scars | `skin_hair_scar` |
   | desire, libido, intimacy | `intimacy_desire` |
   | unsure | `not_sure` |

   Add `routine` only if they said how they want to take it: `daily`,
   `bedtime`, `few_per_week`, `plan_ahead`, `topical`, or `no_preference`.
   Do not pass their own words. The tool takes keys only.

   Do not match an injury or acute illness to a treatment; suggest the
   person's own doctor. For a concern that names a treatment's `goal` field,
   call `list_treatments` with that word: "acne" returns Tretinoin Cream
   (Acne care) and "testosterone" returns Enclomiphene Capsules (Testosterone
   support). Pass that single word only: "low testosterone" or "acne
   treatment" returns nothing. The skin goal key does not return Tretinoin.
   Show the match without saying it treats the condition.

2. **Show first.** Show options before asking anything, and do not ask for
   the person's state before a link; the visit confirms it. `otherFormats`
   entries carry no `stateRestrictions`, so when any format of a compound
   lists them, name those states once for the whole compound ("PT-141 does
   not ship to AR, IN, or SC"). If the person gives a state, call
   `check_state_availability` with it and no handle, and offer only formats it
   does not list. If no format of that compound ships there, say so and offer
   no other compound unless the person asks. Drop options whose
   `eligibility.summary` excludes the person's stated age or sex.

3. **Compare.** Show up to three options in a small table: name, format,
   `eligibility.summary` when it is narrower than adults 18 and older, and one
   browsing price per format (see the `rebody` skill, Prices). Skip options
   with an empty `reasons` list and formats with `available: false`. If the
   person names a paused format, say it is not open for new visits, with no
   date and no link. If no
   option has reasons, offer the goal list instead. Say what each is for from
   its own `treatment.goal` field, not the goal label you asked for. Do not paste the `reasons` sentence or the `note`. List
   options with narrower eligibility last. End with one question, such as
   "Which format should I start your visit for?"

4. **Questions.** Answer visit, shipping, refund, privacy, and compounded
   questions with `how_rebody_works` and link the page it returns.

5. **Link.** When the person picks one treatment or format, or asks to start
   or for the link, call `get_start_link` with only `handle` (any other field
   is rejected) and put the link in the same reply. A question about a single
   treatment is not a request for the link; end with a short question that
   leads to it instead. Add in one or two short sentences: about 5 minutes on
   rebodyhealth.com, nothing charged until the payment step, photo ID and any
   labs the visit needs come after payment, a full refund if the clinician
   declines, and the link works for one hour. Name the item's narrower
   `eligibility.summary` and any `stateRestrictions`. If they will open it
   later or forward it, also give `productUrl` from `get_treatment`. Never
   open the link yourself.

## Do not

- Ask about symptoms, conditions, medications, or other health details. The
  visit asks for them.
- Say a treatment will work, or rank one as "best for you".
- Give a dose, schedule, quantity, or days of supply, or read them from SKU
  strings.
- Open the link on the bot's computer or offer a takeover for the visit, ID
  upload, or checkout.
