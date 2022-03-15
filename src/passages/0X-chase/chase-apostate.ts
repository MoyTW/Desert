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

  _setup.Complete_ChaseApostate_Christies = function() {
    const _vars = State.variables as any;

    if (!_vars.ChaseApostate_CHOICE || !_vars.ChaseFaithful_CHOICE) { return }

    _incrementTurn();
  
    _vars.ChaseApostate_CHOICE_LAST = _vars.ChaseApostate_CHOICE
    _vars.ChaseFaithful_CHOICE_LAST = _vars.ChaseFaithful_CHOICE
    delete _vars.ChaseApostate_CHOICE
    delete _vars.ChaseFaithful_CHOICE

    const apostateChoice = _vars.ChaseApostate_CHOICE_LAST.choice
    if (apostateChoice === "FOOT") {
      Engine.play("ChaseApostate_OnFoot")
    } else if (apostateChoice === "911" ) {
      Engine.play("ChaseApostate_911")
    } else if (apostateChoice === "CAR" ) {
      Engine.play("ChaseApostate_Car")
    } else if (apostateChoice === "KING" ) {
      Engine.play("ChaseApostate_King")
    } else if (apostateChoice === "BAR" ) {
      Engine.play("ChaseApostate_Bar")
    } else if (apostateChoice === "FREEZE" ) {
      Engine.play("ChaseApostate_Freeze")
    }
  }
})()