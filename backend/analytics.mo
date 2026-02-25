import Text "mo:core/Text";
import Map "mo:core/Map";

module {
  public type Analytics = {
    var pageVisitCounts : Map.Map<Text, Nat>;
    var submissionCounts : Map.Map<Text, Nat>;
  };

  public func empty() : Analytics {
    {
      var pageVisitCounts = Map.empty<Text, Nat>();
      var submissionCounts = Map.empty<Text, Nat>();
    };
  };

  public func recordPageVisit(self : Analytics, pageName : Text) {
    let currentCount = switch (self.pageVisitCounts.get(pageName)) {
      case (?count) { count };
      case (null) { 0 };
    };
    self.pageVisitCounts.add(pageName, currentCount + 1);
  };

  public func recordFormSubmission(self : Analytics, formType : Text) {
    let currentCount = switch (self.submissionCounts.get(formType)) {
      case (?count) { count };
      case (null) { 0 };
    };
    self.submissionCounts.add(formType, currentCount + 1);
  };

  public func getAggregatedCounts(self : Analytics) : {
    pageVisits : Map.Map<Text, Nat>;
    submissions : Map.Map<Text, Nat>;
  } {
    {
      pageVisits = self.pageVisitCounts;
      submissions = self.submissionCounts;
    };
  };
};
