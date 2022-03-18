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
    ["BAR", ["ChaseApostate_Bar", () => {
      (State.variables as any).bartenderAction = "TALK";
      (State.variables as any).cookAction = "TALK";
    }]],
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
      ["PREVENT", ["ChaseApostate_Bar_Prevent", () => {
        (State.variables as any).calledFrancis = true;
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "PET_CLINIC";
      }]],
      ["TREAT", ["ChaseApostate_Bar_Treat", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "FIRST_AID";
      }]],
      ["ALLOW", ["ChaseApostate_Bar_Allow", () => {
        // TODO: Vary the lockout message
        (State.variables as any).apostateCanCall911 = false;
        (State.variables as any).called911 = true;
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["FREEZE", ["ChaseApostate_Bar", () => {}]], /* TODO: explainer line? */
    ])],
    ["ChaseApostate_Bar_Prevent", _apostateChristiesRouting],
    ["ChaseApostate_Bar_Treat", _apostateChristiesRouting],
    ["ChaseApostate_Bar_Allow", _apostateChristiesRouting],
  ])

  const _faithfulChristiesRouting = new Map<string,[string, () => void]>([
    ["FOOT", ["ChaseFaithful_OnFoot", () => {}]],
    ["911", ["ChaseFaithful_911", () => {
      (State.variables as any).faithfulCanCall911 = false
    }]],
    ["FRANCIS", ["ChaseFaithful_Francis", () => {}]],
    ["CAR", ["ChaseFaithful_Car", () => {}]],
    ["KING", ["ChaseFaithful_King", () => {}]],
    ["BAR", ["ChaseFaithful_Bar", () => {
      (State.variables as any).bartenderAction = "TALK";
      (State.variables as any).cookAction = "TALK";
    }]],
    ["FREEZE", ["ChaseFaithful_Christies", () => {}]],
  ])

  const _faithfulRoutingTable = new Map<string, Map<string,[string, () => void]>>([
    ["ChaseFaithful_Christies", _faithfulChristiesRouting],
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
    // ########################################################################
    // # 911                                                                  #
    // ########################################################################
    ["ChaseFaithful_911", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseFaithful_911_Tiger", () => {
        (State.variables as any).faithfulReportedTiger = true;
        (State.variables as any).called911 = true;
      }]],
      ["KING", ["ChaseFaithful_911_King", () => {
        (State.variables as any).faithfulKingReturnScene = "TIGER";
        (State.variables as any).faithfulCanReportKingTo911 = false;
      }]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseFaithful_911_Tiger_2", () => {}]],
      ["KING", ["ChaseFaithful_911_King", () => {
        (State.variables as any).faithfulKingReturnScene = "TIGER_2";
        (State.variables as any).faithfulCanReportKingTo911 = false;
      }]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911_Tiger", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_2", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_3", () => {}]],
      ["KING", ["ChaseFaithful_911_Tiger_King", () => {
        (State.variables as any).faithfulKingReturnScene = "TIGER_3";
        (State.variables as any).faithfulCanReportKingTo911 = false;
      }]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911_Tiger_2", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_3", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_4", () => {}]],
      ["KING", ["ChaseFaithful_911_Tiger_King", () => {
        (State.variables as any).faithfulKingReturnScene = "TIGER_4";
        (State.variables as any).faithfulCanReportKingTo911 = false;
      }]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911_Tiger_3", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_4", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_5", () => {}]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911_Tiger_4", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_5", new Map<string,[string, () => void]>([
      ["STAY", ["ChaseFaithful_911_Tiger_6", () => {}]],
      ["BARTENDER", ["ChaseFaithful_911_Tiger_Bartender", () => {
        (State.variables as any).bartenderAction = "FIRST_AID";
        (State.variables as any).cookAction = "911";
      }]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911_Tiger_5", () => {}]],
    ])],
    ["ChaseFaithful_911_Tiger_Bartender", _faithfulChristiesRouting],
    ["ChaseFaithful_911_King", new Map<string,[string, () => void]>([
      ["TIGER", ["ChaseFaithful_911_Tiger", () => {}]],
      ["TIGER_2", ["ChaseFaithful_911_Tiger_2", () => {}]],
      ["TIGER_3", ["ChaseFaithful_911_Tiger_3", () => {}]],
      ["TIGER_4", ["ChaseFaithful_911_Tiger_4", () => {}]],
      ["NONE", ["ChaseFaithful_Christies", () => {
        (State.variables as any).faithfulCanCall911 = false
      }]], // TODO: First line should be 'your action'
      ["FREEZE", ["ChaseFaithful_911_King", () => {}]],
    ])],
    // ########################################################################
    // # BAR                                                                  #
    // ########################################################################
    ["ChaseFaithful_Bar", new Map<string,[string, () => void]>([
      ["PET", ["ChaseFaithful_Bar_Pet", () => {
        // TODO: Vary the lockout message
        (State.variables as any).faithfulCanCallFrancis = false;
        (State.variables as any).calledFrancis = true;
        (State.variables as any).cookAction = "PET_CLINIC"
      }]],
      ["TREAT", ["ChaseFaithful_Bar_Treat", () => {
        (State.variables as any).cookAction = "FIRST_AID"
      }]],
      ["ALLOW", ["ChaseFaithful_Bar_Allow", () => {
        // TODO: Vary the lockout message
        (State.variables as any).faithfulCanCall911 = false;
        (State.variables as any).called911 = true;
        (State.variables as any).cookAction = "911";
      }]],
      ["FREEZE", ["ChaseFaithful_Bar", () => {}]],
    ])],
    ["ChaseFaithful_Bar_Pet", _faithfulChristiesRouting],
    ["ChaseFaithful_Bar_Treat", _faithfulChristiesRouting],
    ["ChaseFaithful_Bar_Allow", _faithfulChristiesRouting],
  ])
})()