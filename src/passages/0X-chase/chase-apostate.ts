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

  const _routingTable = new Map<string, Map<string,string>>([
    ["ChaseApostate_Christies", new Map<string,string>([
      ["FOOT", "ChaseApostate_OnFoot"],
      ["911", "ChaseApostate_911"],
      ["CAR", "ChaseApostate_Car"],
      ["KING", "ChaseApostate_King"],
      ["BAR", "ChaseApostate_Bar"],
      ["FREEZE", "ChaseApostate_Christies"],
    ])],
    ["ChaseApostate_OnFoot", new Map<string,string>([
      ["FOOT", "ChaseApostate_OnFoot_2"],
      ["BACK", "ChaseApostate_Christies"],
      ["FREEZE", "ChaseApostate_OnFoot"],
    ])],
    ["ChaseApostate_OnFoot_2", new Map<string,string>([
      ["FOOT", "ChaseApostate_OnFoot_3"],
      ["BACK", "ChaseApostate_Christies"],
      ["FREEZE", "ChaseApostate_OnFoot_2"],
    ])],
    ["ChaseApostate_OnFoot_3", new Map<string,string>([
      ["ROAD", "ChaseApostate_OnFoot_Road"],
      ["SIDEWALK", "ChaseApostate_OnFoot_Sidewalk"],
      ["FREEZE", "ChaseApostate_OnFoot_3"], /* TODO: You get shot */
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
    Engine.play(_routingTable.get(passage())?.get(apostateChoice)!)
  }
})()