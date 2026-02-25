import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Analytics "analytics";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Investigation = {
    title : Text;
    description : Text;
    date : Time.Time;
    location : Text;
    status : Text;
  };

  public type Testimonial = {
    author : Text;
    quote : Text;
    date : Time.Time;
  };

  public type TeamMember = {
    name : Text;
    role : Text;
    bio : Text;
  };

  let investigations = Map.empty<Text, Investigation>();
  let testimonials = Map.empty<Text, Testimonial>();
  let teamMembers = Map.empty<Text, TeamMember>();

  let analytics = Analytics.empty();

  // Investigation CRUD
  public query ({ caller }) func getInvestigation(_caller : Text) : async ?Investigation {
    investigations.get(_caller);
  };

  public query ({ caller }) func getAllInvestigations() : async [Investigation] {
    investigations.values().toArray();
  };

  // Admin-restricted create investigation
  public shared ({ caller }) func createInvestigation(id : Text, investigation : Investigation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create investigations");
    };
    investigations.add(id, investigation);
  };

  public shared ({ caller }) func updateInvestigation(id : Text, investigation : Investigation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update investigations");
    };
    investigations.add(id, investigation);
  };

  public shared ({ caller }) func deleteInvestigation(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete investigations");
    };
    investigations.remove(id);
  };

  // Verification function - admin only
  public shared ({ caller }) func verifyAdmin() : async Bool {
    if ((AccessControl.hasPermission(accessControlState, caller, #admin))) {
      return true;
    };
    Runtime.trap("Unauthorized: Only admins can verify admin status");
  };

  // Testimonial CRUD
  public query ({ caller }) func getTestimonial(id : Text) : async ?Testimonial {
    testimonials.get(id);
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public shared ({ caller }) func createTestimonial(id : Text, testimonial : Testimonial) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create testimonials");
    };
    testimonials.add(id, testimonial);
  };

  public shared ({ caller }) func updateTestimonial(id : Text, testimonial : Testimonial) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update testimonials");
    };
    testimonials.add(id, testimonial);
  };

  public shared ({ caller }) func deleteTestimonial(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete testimonials");
    };
    testimonials.remove(id);
  };

  // Team Member CRUD
  public query ({ caller }) func getTeamMember(id : Text) : async ?TeamMember {
    teamMembers.get(id);
  };

  public query ({ caller }) func getAllTeamMembers() : async [TeamMember] {
    teamMembers.values().toArray();
  };

  public shared ({ caller }) func createTeamMember(id : Text, member : TeamMember) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create team members");
    };
    teamMembers.add(id, member);
  };

  public shared ({ caller }) func updateTeamMember(id : Text, member : TeamMember) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update team members");
    };
    teamMembers.add(id, member);
  };

  public shared ({ caller }) func deleteTeamMember(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete team members");
    };
    teamMembers.remove(id);
  };

  // Analytics Tracking
  public shared ({ caller }) func recordPageVisit(pageName : Text) : async () {
    analytics.recordPageVisit(pageName);
  };

  public shared ({ caller }) func recordFormSubmission(formType : Text) : async () {
    analytics.recordFormSubmission(formType);
  };

  public query ({ caller }) func getAggregatedAnalytics() : async {
    pageVisits : [(Text, Nat)];
    submissions : [(Text, Nat)];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };

    let counts = analytics.getAggregatedCounts();
    {
      pageVisits = counts.pageVisits.toArray();
      submissions = counts.submissions.toArray();
    };
  };
};
