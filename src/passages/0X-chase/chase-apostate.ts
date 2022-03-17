(function() {
  const _setup = setup as any

  _setup.Complete_ChaseApostate_Start = function() {
    const _vars = State.variables as any;

    if (_vars.ChaseApostate_Start_DONE && _vars.ChaseFaithful_Start_DONE) {
      delete _vars.ChaseApostate_Start_DONE;
      delete _vars.ChaseFaithful_Start_DONE;
      Engine.play('ChaseApostate_Christies');
    }
  }

  const _incrementTurn = function() {
    (State.variables as any).chaseTurn++
  }

  const _routingTable = new Map<string, Map<string,[string, () => void]>>([
    ["ChaseApostate_Christies", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot", () => {}]],
      ["911", ["ChaseApostate_911", () => {}]],
      ["CAR", ["ChaseApostate_Car", () => {}]],
      ["KING", ["ChaseApostate_King", () => {}]],
      ["BAR", ["ChaseApostate_Bar", () => {}]],
      ["FREEZE", ["ChaseApostate_Christies", () => {}]],
    ])],
    ["ChaseApostate_OnFoot", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot_2", () => {}]],
      ["BACK", ["ChaseApostate_Christies", () => {
        (State.variables as any).canChaseOnFoot = false
      }]],
      ["FREEZE", ["ChaseApostate_OnFoot", () => {}]],
    ])],
    ["ChaseApostate_OnFoot_2", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot_3", () => {}]],
      ["BACK", ["ChaseApostate_Christies", () => {
        (State.variables as any).canChaseOnFoot = false
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
        (State.variables as any).canCall911 = false
      }]],
      ["FREEZE", ["ChaseApostate_911", () => {}]],
    ])],
    ["ChaseApostate_Car", new Map<string,[string, () => void]>([
      ["EXIT", ["ChaseApostate_Christies", () => {}]], /* TODO: "what did you last do" */
      ["FREEZE", ["ChaseApostate_Car", () => {}]], /* TODO: explainer line? */
    ])],
    // Ebi's Bar options all conclude with Christie's options
    ["ChaseApostate_Bar", new Map<string,[string, () => void]>([
      ["PREVENT", ["ChaseApostate_Bar_Prevent", () => {}]], /* TODO: last action */
      ["TREAT", ["ChaseApostate_Bar_Treat", () => {}]], /* TODO: record side effect */
      ["ALLOW", ["ChaseApostate_Bar_Allow", () => {}]], /* TODO: record side effect */
      ["FREEZE", ["ChaseApostate_Car", () => {}]], /* TODO: explainer line? */
    ])],
    ["ChaseApostate_Bar_Prevent", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot", () => {}]],
      ["911", ["ChaseApostate_911", () => {}]],
      ["CAR", ["ChaseApostate_Car", () => {}]],
      ["KING", ["ChaseApostate_King", () => {}]],
      ["FREEZE", ["ChaseApostate_Christies", () => {}]],
    ])],
    ["ChaseApostate_Bar_Treat", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot", () => {}]],
      ["911", ["ChaseApostate_911", () => {}]],
      ["CAR", ["ChaseApostate_Car", () => {}]],
      ["KING", ["ChaseApostate_King", () => {}]],
      ["FREEZE", ["ChaseApostate_Christies", () => {}]],
    ])],
    ["ChaseApostate_Bar_Allow", new Map<string,[string, () => void]>([
      ["FOOT", ["ChaseApostate_OnFoot", () => {}]],
      ["911", ["ChaseApostate_911", () => {}]],
      ["CAR", ["ChaseApostate_Car", () => {}]],
      ["KING", ["ChaseApostate_King", () => {}]],
      ["FREEZE", ["ChaseApostate_Christies", () => {}]],
    ])],
  ])

  _setup.Route_ChaseApostate_Choice = function() {
    const _vars = State.variables as any;

    if (!_vars.ChaseApostate_CHOICE || !_vars.ChaseFaithful_CHOICE) { return }

    _incrementTurn();
  
    _vars.ChaseApostate_CHOICE_LAST = _vars.ChaseApostate_CHOICE
    _vars.ChaseFaithful_CHOICE_LAST = _vars.ChaseFaithful_CHOICE
    delete _vars.ChaseApostate_CHOICE
    delete _vars.ChaseFaithful_CHOICE

    const apostateChoice: string = _vars.ChaseApostate_CHOICE_LAST.choice
    const [nextPassage, passageFn] =_routingTable.get(passage())?.get(apostateChoice)!
    passageFn()
    Engine.play(nextPassage)
  }
})()