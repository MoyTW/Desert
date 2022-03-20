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

  _setup.Route_ChaseApostate_Choice = function() {
    const _vars = State.variables as any;

    if (!_vars.ChaseApostate_CHOICE || !_vars.ChaseFaithful_CHOICE) { return }

    _vars.ChaseApostate_CHOICE_LAST = _vars.ChaseApostate_CHOICE
    _vars.ChaseFaithful_CHOICE_LAST = _vars.ChaseFaithful_CHOICE
    delete _vars.ChaseApostate_CHOICE
    delete _vars.ChaseFaithful_CHOICE

    const apostateChoice: string = _vars.ChaseApostate_CHOICE_LAST.choice
    const apostatePassage: string = _vars.ChaseApostate_CHOICE_LAST.passage
    const faithfulChoice: string = _vars.ChaseFaithful_CHOICE_LAST.choice
    const faithfulPassage: string = _vars.ChaseFaithful_CHOICE_LAST.passage

    const [nextFaithfulPassage, faithfulPassageFn] = _setup.Chase.GetFaithfulData(faithfulPassage, faithfulChoice)
    _vars.faithfulPassage = nextFaithfulPassage
    faithfulPassageFn()

    const [nextPassage, apostatePassageFn] = _setup.Chase.GetApostateData(apostatePassage, apostateChoice)
    _vars.apostatePassage = nextPassage
    apostatePassageFn()

    _setup.Chase.IncrementTurn()
    Engine.play(nextPassage)
  }
})()