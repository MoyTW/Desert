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
})()