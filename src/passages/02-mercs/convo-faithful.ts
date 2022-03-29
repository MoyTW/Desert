(function() {
  const _setup = setup as any

  _setup.Route_ConvoFaithful_Receiver = function() {
    const _vars = State.variables as any;

    if (_vars.ConvoFaithful_Continue && _vars.ConvoApostate_Choices) {
      const apostateChoice = _vars.ConvoApostate_Choices.choice
      delete _vars.ConvoFaithful_Continue
      delete _vars.ConvoApostate_Choices

      if (apostateChoice === "LIFE") {
        Engine.play("ConvoFaithful_Ebi_Life")
      } else if (apostateChoice === "WEATHER") {
        Engine.play("ConvoFaithful_Ebi_Weather")
      } else if (apostateChoice === "MOTHER") {
        Engine.play("ConvoFaithful_Ebi_Mother")
      } else if (apostateChoice === "RENO") {
        Engine.play("ConvoFaithful_Ebi_Reno")
      } else {
        throw `Unknown apostateChoice ${apostateChoice}!`
      }
    }
  }

  _setup.Complete_ConvoFaithful_Jeku_Implants = function() {
    const _vars = State.variables as any

    if (_vars.ConvoFaithful_Jeku_Implants && _vars.ConvoApostate_Jeku_Implants) {
      const apostateChoice = _vars.ConvoApostate_Jeku_Implants.choice
      delete _vars.ConvoFaithful_Jeku_Implants
      delete _vars.ConvoApostate_Jeku_Implants

      if (apostateChoice === "TALK") {
        Engine.play("ConvoFaithful_Jeku_Implants_Talk")
      } else if (apostateChoice === "EVADE") {
        Engine.play("ConvoFaithful_Jeku_Implants_Evade")
      }
    }
  }

  _setup.Complete_ConvoFaithful_Ebi_Reno = function() {
    const _vars = State.variables as any

    if (_vars.ConvoFaithful_Ebi_Reno && _vars.ConvoApostate_Ebi_Reno) {
      const apostateChoice = _vars.ConvoApostate_Ebi_Reno.choice
      delete _vars.ConvoFaithful_Ebi_Reno
      delete _vars.ConvoApostate_Ebi_Reno

      if (apostateChoice === "PUSH") {
        Engine.play("ConvoFaithful_Ebi_Reno_Push")
      } else if (apostateChoice === "DROP") {
        Engine.play("ConvoFaithful_Ebi_Reno_Drop")
      }
    }
  }
})()