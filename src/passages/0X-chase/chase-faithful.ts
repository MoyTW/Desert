(function() {
  const _setup = setup as any

  _setup.Complete_ChaseFaithful_Start = function() {
    const _vars = State.variables as any;

    if (_vars.ChaseFaithful_Start_DONE && _vars.ChaseApostate_Start_DONE) {
      delete _vars.ChaseFaithful_Start_DONE;
      delete _vars.ChaseApostate_Start_DONE;
      Engine.play('ChaseFaithful_Christies');
    }
  }

  const _incrementTurn = function() {
    (State.variables as any).chaseTurn++
  }

  const _routingTable = new Map<string, Map<string,string>>([
    ["ChaseFaithful_Christies", new Map<string,string>([
      ["FOOT", "ChaseFaithful_OnFoot"],
      ["911", "ChaseFaithful_911"],
      ["FRANCIS", "ChaseFaithful_Francis"],
      ["CAR", "ChaseFaithful_Car"],
      ["KING", "ChaseFaithful_King"],
      ["BAR", "ChaseFaithful_Bar"],
      ["FREEZE", "ChaseFaithful_Christies"],
    ])],
    ["ChaseFaithful_OnFoot", new Map<string,string>([
      ["FOOT", "ChaseFaithful_OnFoot_2"],
      ["BACK", "ChaseFaithful_Christies"],
      ["FREEZE", "ChaseFaithful_OnFoot"],
    ])],
  ])

  _setup.Complete_ChaseFaithful_Christies = function() {
    const _vars = State.variables as any;

    if (!_vars.ChaseFaithful_CHOICE || !_vars.ChaseApostate_CHOICE) { return }

    _incrementTurn();

    _vars.ChaseApostate_CHOICE_LAST = _vars.ChaseApostate_CHOICE
    _vars.ChaseFaithful_CHOICE_LAST = _vars.ChaseFaithful_CHOICE
    delete _vars.ChaseApostate_CHOICE
    delete _vars.ChaseFaithful_CHOICE

    const faithfulChoice = _vars.ChaseFaithful_CHOICE_LAST.choice
    Engine.play(_routingTable.get(passage())?.get(faithfulChoice)!)
  }
})()