/**
 * @fileOverview Hierarchical Settings
 * @module util/Settings
 */
'use strict';
module.exports = function registerSettings(mm) {
  var _ = mm._;
  var format = mm.format;

  /**
   * @class
   * @summary **Create a Settings**
   * @description
   * A Settings is a list of key value pairs - almost like a POJO.
   * The key differences are that settings exist in a context hierarchy
   * to allow inherited keys, and settings can have attributes that control
   * visibility, access, and modification.
   *
   * Settings are created from within a container of some sort (a workspace,
   * user, document, etc.) The container for a settings is expected to
   * in turn contain a _context member, and this Settings object will be
   * added to it as its _settings member.
   * @constructor
   * @param {Object} container The object to which these settings apply
   * @param {Object} attributes Attributes for available settings
   * @returns {Settings} the new set of Settings
   */
  var Settings = (function settingsCtorCreator() {
    return function Settings(container, attributes) {
      var self = this;
      self._container = container;
      self._attributes = {};
    }
  }());

  return Settings;
}
