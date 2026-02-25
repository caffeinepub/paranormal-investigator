import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Migration "migration";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";

// Apply migration on upgrade
(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  stable var adminPrincipal : ?Principal = null;

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

  public type AdminCaseResult = {
    success : Bool;
    message : Text;
  };

  public type CaseStatusChange = {
    caseId : Text;
    fromStatus : Text;
    toStatus : Text;
    timestamp : Time.Time;
    changedBy : Text;
  };

  let investigations = Map.empty<Text, Investigation>();
  let testimonials = Map.empty<Text, Testimonial>();
  let teamMembers = Map.empty<Text, TeamMember>();
  let cases = Map.empty<Text, Case>();
  let caseStatusChanges = Map.empty<Text, List.List<CaseStatusChange>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let adminCredentials = {
    email = "stuartisaiah2@gmail.com";
    pin = "022025";
  };

  // Helper: check whether a principal is anonymous
  func isAnonymous(p : Principal) : Bool {
    p.isAnonymous()
  };

  // Helper method to check if caller is the admin.
  // If no admin has been registered yet, the first non-anonymous caller
  // of any admin-gated function is automatically granted admin status.
  func assertIsAdmin(caller : Principal) : () {
    if (isAnonymous(caller)) {
      Runtime.trap("Unauthorized: Anonymous principals cannot perform admin operations");
    };
    switch (adminPrincipal) {
      case (?admin) {
        if (caller != admin) {
          Runtime.trap("Unauthorized: Only the registered admin can perform this operation");
        };
      };
      case (null) {
        // No admin registered yet — auto-grant to the first non-anonymous caller
        adminPrincipal := ?caller;
      };
    };
  };

  // Admin Initialization Function
  // Explicitly initializes the admin. Returns true if the caller became admin,
  // false if an admin was already registered.
  // Anonymous callers are rejected.
  public shared ({ caller }) func initAdmin() : async Bool {
    if (isAnonymous(caller)) {
      Runtime.trap("Unauthorized: Anonymous principals cannot be registered as admin");
    };
    switch (adminPrincipal) {
      case (null) {
        adminPrincipal := ?caller;
        true;
      };
      case (?_existingAdmin) {
        false;
      };
    };
  };

  // Returns the currently registered admin principal, if any.
  // This is a public query so the frontend can check whether an admin exists.
  public query func getAdminPrincipal() : async ?Principal {
    adminPrincipal;
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

    // Non-admin users may only look up cases associated with their own email.
    // Admin is identified by the stored adminPrincipal.
    let callerIsAdmin = switch (adminPrincipal) {
      case (?admin) { caller == admin };
      case (null) { false };
    };

    if (not callerIsAdmin) {
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
    assertIsAdmin(caller);
    cases.values().toArray();
  };

  public query ({ caller }) func getCaseById(caseId : Text) : async ?Case {
    assertIsAdmin(caller);
    cases.get(caseId);
  };

  public shared ({ caller }) func markCaseResolved(caseId : Text, adminEmail : Text) : async AdminCaseResult {
    assertIsAdmin(caller);
    switch (cases.get(caseId)) {
      case (?existingCase) {
        let updatedCase = { existingCase with resolved = true };
        cases.add(caseId, updatedCase);

        let statusChange = {
          caseId;
          fromStatus = if (existingCase.resolved) { "Resolved" } else { "Open" };
          toStatus = "Resolved";
          timestamp = Time.now();
          changedBy = adminEmail;
        };

        switch (caseStatusChanges.get(caseId)) {
          case (?existingChanges) {
            existingChanges.add(statusChange);
            caseStatusChanges.add(caseId, existingChanges);
          };
          case (null) {
            let changeList = List.fromArray<{ caseId : Text; fromStatus : Text; toStatus : Text; timestamp : Time.Time; changedBy : Text }>([statusChange]);
            caseStatusChanges.add(caseId, changeList);
          };
        };

        {
          success = true;
          message = "Case marked as resolved successfully";
        };
      };
      case (null) {
        { success = false; message = "Case not found" };
      };
    };
  };

  public shared ({ caller }) func deleteCase(caseId : Text) : async Bool {
    assertIsAdmin(caller);
    switch (cases.get(caseId)) {
      case (?_) {
        cases.remove(caseId);
        true;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getAdminCredentials() : async AdminCredentials {
    assertIsAdmin(caller);
    adminCredentials;
  };

  // Admin-only: case status history contains internal operational data
  public query ({ caller }) func getCaseStatusChanges(caseId : Text) : async [CaseStatusChange] {
    assertIsAdmin(caller);
    switch (caseStatusChanges.get(caseId)) {
      case (?changes) { changes.toArray() };
      case (null) { [] };
    };
  };

  // Open endpoint: used by the frontend login flow to verify credentials before
  // granting admin access. Does not expose secrets beyond confirming a match.
  public shared ({ caller }) func verifyAdminCredentials(email : Text, pin : Text) : async Bool {
    email == adminCredentials.email and pin == adminCredentials.pin;
  };

  // Verification function - admin only
  public shared ({ caller }) func verifyAdmin() : async Bool {
    assertIsAdmin(caller);
    true;
  };

  // Investigation CRUD
  public query ({ caller }) func getInvestigation(id : Text) : async ?Investigation {
    investigations.get(id);
  };

  public query ({ caller }) func getAllInvestigationCases() : async [Investigation] {
    investigations.values().toArray();
  };

  public shared ({ caller }) func createInvestigation(id : Text, investigation : Investigation) : async () {
    assertIsAdmin(caller);
    investigations.add(id, investigation);
  };

  public shared ({ caller }) func updateInvestigation(id : Text, investigation : Investigation) : async () {
    assertIsAdmin(caller);
    investigations.add(id, investigation);
  };

  public shared ({ caller }) func deleteInvestigation(id : Text) : async () {
    assertIsAdmin(caller);
    investigations.remove(id);
  };

  // Testimonial CRUD
  public query ({ caller }) func getTestimonial(id : Text) : async ?Testimonial {
    testimonials.get(id);
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public shared ({ caller }) func createTestimonial(id : Text, testimonial : Testimonial) : async () {
    assertIsAdmin(caller);
    testimonials.add(id, testimonial);
  };

  public shared ({ caller }) func updateTestimonial(id : Text, testimonial : Testimonial) : async () {
    assertIsAdmin(caller);
    testimonials.add(id, testimonial);
  };

  public shared ({ caller }) func deleteTestimonial(id : Text) : async () {
    assertIsAdmin(caller);
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
    assertIsAdmin(caller);
    teamMembers.add(id, member);
  };

  public shared ({ caller }) func updateTeamMember(id : Text, member : TeamMember) : async () {
    assertIsAdmin(caller);
    teamMembers.add(id, member);
  };

  public shared ({ caller }) func deleteTeamMember(id : Text) : async () {
    assertIsAdmin(caller);
    teamMembers.remove(id);
  };
};
