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

    const faithfulChoice: string = _vars.ChaseFaithful_CHOICE_LAST.choice
    const faithfulPassage: string = _vars.ChaseFaithful_CHOICE_LAST.passage
    const apostateChoice: string = _vars.ChaseApostate_CHOICE_LAST.choice
    const apostatePassage: string = _vars.ChaseApostate_CHOICE_LAST.passage

    const [_, apostatePassageFn] = _setup.Chase.GetApostateData(apostatePassage, apostateChoice)
    apostatePassageFn()

    const [nextPassage, passageFn] = _setup.Chase.GetFaithfulData(faithfulPassage, faithfulChoice)
    passageFn()
    Engine.play(nextPassage)
  }
})()