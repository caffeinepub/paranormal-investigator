import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";

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

  public type AdminCredentials = {
    email : Text;
    pin : Text;
  };

  public type Case = {
    id : Text;
    location : Text;
    phenomenaType : Text;
    description : Text;
    contactInfo : Text;
    ownerEmail : Text;
    photo : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    resolved : Bool;
  };

  public type CaseSummary = {
    caseId : Text;
    location : Text;
    phenomenaType : Text;
    status : Text;
  };

  public type CaseLookupResult = {
    hasCase : Bool;
    caseSummaries : [CaseSummary];
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let investigations = Map.empty<Text, Investigation>();
  let testimonials = Map.empty<Text, Testimonial>();
  let teamMembers = Map.empty<Text, TeamMember>();
  let cases = Map.empty<Text, Case>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let adminCredentials = {
    email = "stuartisaiah2@gmail.com";
    pin = "022025";
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  // Find cases for the authenticated user by email.
  // A regular user may only query cases linked to their own profile email.
  // An admin may query cases for any email.
  public query ({ caller }) func getCasesForUser(email : Text) : async CaseLookupResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can look up cases");
    };

    // Non-admin users may only look up cases associated with their own email
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      switch (userProfiles.get(caller)) {
        case (?profile) {
          if (not Text.equal(profile.email, email)) {
            Runtime.trap("Unauthorized: You can only look up cases linked to your own email");
          };
        };
        case (null) {
          Runtime.trap("Unauthorized: No profile found; save your profile before looking up cases");
        };
      };
    };

    let caseList = cases.filter(
      func(_id, c) {
        Text.equal(c.ownerEmail, email) and not c.resolved
      }
    );

    if (caseList.size() == 0) {
      return { hasCase = false; caseSummaries = [] };
    };

    let caseSummaries = caseList.toArray().map(
      func((id, c)) {
        {
          caseId = id;
          location = c.location;
          phenomenaType = c.phenomenaType;
          status = if (c.resolved) { "Resolved" } else { "Open" };
        };
      }
    );

    { hasCase = true; caseSummaries };
  };

  // Case Management
  // submitCase is intentionally public (no auth required) so anonymous visitors
  // can submit paranormal case reports via the public submission form.
  public shared ({ caller }) func submitCase(
    location : Text,
    phenomenaType : Text,
    description : Text,
    contactInfo : Text,
    photo : ?Storage.ExternalBlob,
    ownerEmail : Text,
  ) : async Text {
    let caseId = Time.now().toText();
    let newCase : Case = {
      id = caseId;
      location;
      phenomenaType;
      description;
      contactInfo;
      ownerEmail;
      photo;
      timestamp = Time.now();
      resolved = false;
    };
    cases.add(caseId, newCase);
    caseId;
  };

  public query ({ caller }) func getAllCases() : async [Case] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access cases");
    };
    cases.values().toArray();
  };

  public shared ({ caller }) func markCaseResolved(caseId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can resolve cases");
    };
    switch (cases.get(caseId)) {
      case (?existingCase) {
        let updatedCase = { existingCase with resolved = true };
        cases.add(caseId, updatedCase);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteCase(caseId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete cases");
    };
    switch (cases.get(caseId)) {
      case (?_) {
        cases.remove(caseId);
        true;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getAdminCredentials() : async AdminCredentials {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access credentials");
    };
    adminCredentials;
  };

  // verifyAdminCredentials is kept accessible without an auth guard because it
  // is used as part of the legacy credential-based login flow before a session
  // is established. It does not return sensitive data.
  public shared ({ caller }) func verifyAdminCredentials(email : Text, pin : Text) : async Bool {
    email == adminCredentials.email and pin == adminCredentials.pin;
  };

  // Investigation CRUD
  public query ({ caller }) func getInvestigation(id : Text) : async ?Investigation {
    investigations.get(id);
  };

  public query ({ caller }) func getAllInvestigationCases() : async [Investigation] {
    investigations.values().toArray();
  };

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
    if (AccessControl.hasPermission(accessControlState, caller, #admin)) {
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
};
