(function() {
  const _setup = setup as any
  _setup.Chase = {}

  _setup.Chase.GetApostateData = function(passage: string, choice: string): [string, () => void] {
    return _apostateRoutingTable.get(passage)?.get(choice)!
  }

  _setup.Chase.GetFaithfulData = function(passage: string, choice: string): [string, () => void] {
    return _faithfulRoutingTable.get(passage)?.get(choice)!
  }

  const _apostateChristiesRouting = new Map<string,[string, () => void]>([
    ["FOOT", ["ChaseApostate_OnFoot", () => {}]],
    ["911", ["ChaseApostate_911", () => {}]],
    ["CAR", ["ChaseApostate_Car", () => {}]],
    ["KING", ["ChaseApostate_King", () => {}]],
    ["BAR", ["ChaseApostate_Bar", () => {}]],
    ["FREEZE", ["ChaseApostate_Christies", () => {}]],
  ])

  const _apostateRoutingTable = new Map<string, Map<string,[string, () => void]>>([
    ["ChaseApostate_Christies", _apostateChristiesRouting],
    ["ChaseApostate_OnFoot", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot_2", () => {}]],
      ["BACK", ["ChaseApostate_Christies", () => {
        (State.variables as any).apostateCanChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot", () => {}]],
    ])],
    ["ChaseApostate_OnFoot_2", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot_3", () => {}]],
      ["BACK", ["ChaseApostate_Christies", () => {
        (State.variables as any).apostateCanChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot_2", () => {}]],
    ])],
    ["ChaseApostate_OnFoot_3", new Map<string,[string, () => void]>([
      ["ROAD", ["ChaseApostate_OnFoot_Road", () => {}]],
      ["SIDEWALK", ["ChaseApostate_OnFoot_Sidewalk", () => {}]],
      ["FREEZE", ["ChaseApostate_OnFoot_3", () => {}]], /* TODO: You get shot */
    ])],
    ["ChaseApostate_911", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseApostate_911_Tiger", () => {}]],
      ["KING", ["ChaseApostate_911_King", () => {}]],
      ["BOTH", ["ChaseApostate_911_Both", () => {}]],
      ["NONE", ["ChaseApostate_Christies", () => {
        (State.variables as any).apostateCanCall911 = false
      }]],
      ["FREEZE", ["ChaseApostate_911", () => {}]],
    ])],
    ["ChaseApostate_Car", new Map<string,[string, () => void]>([
      ["EXIT", ["ChaseApostate_Christies", () => {}]], /* TODO: "what did you last do" */
      ["FREEZE", ["ChaseApostate_Car", () => {}]], /* TODO: explainer line? */
    ])],
    ["ChaseApostate_King", new Map<string,[string, () => void]>([
      ["BLEEDING", ["ChaseApostate_King_2", () => {}]],
      ["BAR", ["ChaseApostate_King_Bar", () => {}]],
      ["LEAVE", ["ChaseApostate_King_Leave", () => {
        (State.variables as any).apostateCanTriageKing = false
      }]],
      ["FREEZE", ["ChaseApostate_King", () => {}]],
    ])],
    ["ChaseApostate_King_Leave", _apostateChristiesRouting],
    // Ebi's Bar options all conclude with Christie's options
    ["ChaseApostate_Bar", new Map<string,[string, () => void]>([
      ["PREVENT", ["ChaseApostate_Bar_Prevent", () => {}]], /* TODO: last action */
      ["TREAT", ["ChaseApostate_Bar_Treat", () => {}]], /* TODO: record side effect */
      ["ALLOW", ["ChaseApostate_Bar_Allow", () => {}]], /* TODO: record side effect */
      ["FREEZE", ["ChaseApostate_Car", () => {}]], /* TODO: explainer line? */
    ])],
    ["ChaseApostate_Bar_Prevent", _apostateChristiesRouting],
    ["ChaseApostate_Bar_Treat", _apostateChristiesRouting],
    ["ChaseApostate_Bar_Allow", _apostateChristiesRouting],
  ])

  const _faithfulRoutingTable = new Map<string, Map<string,[string, () => void]>>([
    ["ChaseFaithful_Christies", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseFaithful_OnFoot", () => {}]],
      ["911", ["ChaseFaithful_911", () => {}]],
      ["FRANCIS", ["ChaseFaithful_Francis", () => {}]],
      ["CAR", ["ChaseFaithful_Car", () => {}]],
      ["KING", ["ChaseFaithful_King", () => {}]],
      ["BAR", ["ChaseFaithful_Bar", () => {}]],
      ["FREEZE", ["ChaseFaithful_Christies", () => {}]],
    ])],
    ["ChaseFaithful_OnFoot", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseFaithful_OnFoot_2", () => {}]],
      ["BACK", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseFaithful_OnFoot", () => {}]],
    ])],
    ["ChaseFaithful_OnFoot_2", new Map<string,[string, () => void]>([
      ["BACK", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseFaithful_OnFoot_2", () => {}]],
    ])],
    ["ChaseFaithful_911", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseFaithful_911_Tiger", () => {}]],
      ["KING", ["ChaseFaithful_911_King", () => {}]],
      ["BOTH", ["ChaseFaithful_911_Both", () => {}]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseFaithful_911_Tiger_2", () => {}]], // TODO: Actually modify the state!
      ["BOTH", ["ChaseFaithful_911_Both", () => {}]], // TODO: Maybe not
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911_Tiger", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_2", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_3", () => {}]], // TODO: Actually modify the state!
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {}]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911_Tiger_2", () => {}]],
    ])],
  ])
})()