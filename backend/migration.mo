module {
  type OldActor = {
    // Old actor state without adminPrincipal
  };

  type NewActor = {
    var adminPrincipal : ?Principal;
  };

  public func run(old : OldActor) : NewActor {
    { var adminPrincipal = null };
  };
};
