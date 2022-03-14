(function() {
  const _setup = setup as any

  _setup.Complete_MercsFaithful_Start = function() {
    const _vars = State.variables as any

    if (_vars.MercsFaithful_Start_CHOICE &&
        _vars.MercsApostate_Start_CHOICE) {
      const faithfulChoice = _vars.MercsFaithful_Start_CHOICE.choice
      const apostateChoice = _vars.MercsApostate_Start_CHOICE.choice

      if (faithfulChoice === "CHAT" && apostateChoice === "TALK") {
        Engine.play("MercsFaithful_JekuChat_EbiTalk")
      } else if (faithfulChoice === "CHAT" && apostateChoice === "SILENT") {
        Engine.play("MercsFaithful_JekuChat_EbiSilent")
      } else if (faithfulChoice === "REJECT" && apostateChoice === "TALK") {
        Engine.play("MercsFaithful_JekuReject_EbiTalk")
      } else if (faithfulChoice === "REJECT" && apostateChoice === "SILENT") {
        Engine.play("MercsFaithful_JekuReject_EbiSilent")
      }
    }
  }

  _setup.Complete_MercsFaithful_DiscussCoverStory_Argue = function() {
    const _vars = State.variables as any

    if (_vars.MercsFaithful_DiscussCoverStory_Argue_CHOICE &&
        _vars.MercsApostate_DiscussCoverStory_Argue_CHOICE) {
      const apostateChoice = _vars.MercsApostate_DiscussCoverStory_Argue_CHOICE.choice

      if (apostateChoice === "CONCERNS") {
        Engine.play("MercsFaithful_DiscussCoverStory_Argue_Concerns")
      } else if (apostateChoice === "APOLOGIZE") {
        Engine.play("MercsFaithful_DiscussCoverStory_Argue_Apologize")
      } else if (apostateChoice === "EXPLAIN") {
        Engine.play("MercsFaithful_DiscussCoverStory_Argue_Explain")
      }
    }
  }
})()