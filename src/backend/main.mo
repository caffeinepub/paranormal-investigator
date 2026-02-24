import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Order "mo:core/Order";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type PhenomenaType = {
    #apparitions;
    #unexplainedSounds;
    #movingObjects;
    #electromagneticAnomalies;
  };

  type InvestigationStatus = {
    #submitted;
    #underInvestigation;
    #resolved;
    #inconclusive;
  };

  type ParanormalCase = {
    caseId : Text;
    timestamp : Time.Time;
    location : Text;
    phenomenaType : PhenomenaType;
    description : Text;
    contactInfo : Text;
    status : InvestigationStatus;
    photo : ?Storage.ExternalBlob;
  };

  module ParanormalCase {
    public func compare(a : ParanormalCase, b : ParanormalCase) : Order.Order {
      Text.compare(a.caseId, b.caseId);
    };
  };

  let allCases = List.empty<ParanormalCase>();

  public shared ({ caller }) func submitCase(
    location : Text,
    phenomenaType : PhenomenaType,
    description : Text,
    contactInfo : Text,
    photo : ?Storage.ExternalBlob,
  ) : async Text {
    let caseId = location.concat(Time.now().toText());

    let newCase : ParanormalCase = {
      caseId;
      timestamp = Time.now();
      location;
      phenomenaType;
      description;
      contactInfo;
      status = #submitted;
      photo;
    };

    allCases.add(newCase);
    caseId;
  };

  public shared ({ caller }) func getAllCases() : async [ParanormalCase] {
    allCases.toArray().sort();
  };

  public shared ({ caller }) func filterCasesByType(phenomenaType : PhenomenaType) : async [ParanormalCase] {
    let filteredCases = allCases.filter(
      func(pCase) {
        pCase.phenomenaType == phenomenaType;
      }
    );
    filteredCases.toArray().sort();
  };

  public shared ({ caller }) func filterCasesByLocation(location : Text) : async [ParanormalCase] {
    let filteredCases = allCases.filter(
      func(pCase) {
        switch (Text.compare(pCase.location, location)) {
          case (#equal) { true };
          case (_) { false };
        };
      }
    );
    filteredCases.toArray().sort();
  };

  public shared ({ caller }) func getCaseById(caseId : Text) : async ?ParanormalCase {
    allCases.find(
      func(pCase) {
        switch (Text.compare(pCase.caseId, caseId)) {
          case (#equal) { true };
          case (_) { false };
        };
      }
    );
  };

  public shared ({ caller }) func updateCaseStatus(caseId : Text, newStatus : InvestigationStatus) : async Bool {
    let index = allCases.toArray().findIndex(
      func(pCase) {
        switch (Text.compare(pCase.caseId, caseId)) {
          case (#equal) { true };
          case (_) { false };
        };
      }
    );
    switch (index) {
      case (null) { false };
      case (?foundIndex) {
        let pCase = allCases.toArray()[foundIndex];
        let updatedCase : ParanormalCase = {
          caseId = pCase.caseId;
          timestamp = pCase.timestamp;
          location = pCase.location;
          phenomenaType = pCase.phenomenaType;
          description = pCase.description;
          contactInfo = pCase.contactInfo;
          status = newStatus;
          photo = pCase.photo;
        };

        // Create new array with updated case using Array.tabulate
        let arrayCases = Array.tabulate(
          allCases.size(),
          func(i) {
            if (i == foundIndex) { updatedCase } else { allCases.toArray()[i] };
          },
        );

        // Clear and repopulate allCases
        allCases.clear();
        allCases.addAll(arrayCases.values());
        true;
      };
    };
  };
};
