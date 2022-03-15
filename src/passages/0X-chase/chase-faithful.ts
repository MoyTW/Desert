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

  _setup.Complete_ChaseFaithful_Christies = function() {
    const _vars = State.variables as any;

    if (!_vars.ChaseFaithful_CHOICE || !_vars.ChaseApostate_CHOICE) { return }

    _incrementTurn();

    _vars.ChaseApostate_CHOICE_LAST = _vars.ChaseApostate_CHOICE
    _vars.ChaseFaithful_CHOICE_LAST = _vars.ChaseFaithful_CHOICE
    delete _vars.ChaseApostate_CHOICE
    delete _vars.ChaseFaithful_CHOICE

    const faithfulChoice = _vars.ChaseFaithful_CHOICE_LAST.choice
    if (faithfulChoice === "FOOT") {
      Engine.play("ChaseFaithful_OnFoot")
    } else if (faithfulChoice === "911" ) {
      Engine.play("ChaseFaithful_911")
    } else if (faithfulChoice === "FRANCIS" ) {
      Engine.play("ChaseFaithful_Francis")
    } else if (faithfulChoice === "CAR" ) {
      Engine.play("ChaseFaithful_Car")
    } else if (faithfulChoice === "KING" ) {
      Engine.play("ChaseFaithful_King")
    } else if (faithfulChoice === "BAR" ) {
      Engine.play("ChaseFaithful_Bar")
    } else if (faithfulChoice === "FREEZE" ) {
      Engine.play("ChaseFaithful_Freeze")
    }
  }
})()