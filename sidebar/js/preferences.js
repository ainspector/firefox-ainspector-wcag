"use strict";

// Internationalizationalization of preferences messages

var prefsTitle  = document.getElementById('prefs_title');
prefsTitle.textContent = i18n('prefsTitle');

var prefsGeneralHeading  = document.getElementById('prefs_general_heading');
prefsGeneralHeading.textContent = i18n('prefsGeneralHeading');


var prefsViewsMenuLegend  = document.getElementById('prefs_views_menu_legend');
prefsViewsMenuLegend.textContent = i18n('prefsViewsMenuLegend');

var prefsIncludeGuidelinesLabel  = document.getElementById('prefs_include_guidelines_label');
prefsIncludeGuidelinesLabel.textContent = i18n('prefsIncludeGuidelinesLabel');


var prefsRerunEvaluationLegend  = document.getElementById('prefs_rerun_evaluation_legend');
prefsRerunEvaluationLegend.textContent = i18n('prefsRerunEvaluationLegend');

var prefsNoDelayLabel  = document.getElementById('prefs_no_delay_label');
prefsNoDelayLabel.textContent = i18n('prefsNoDelayLabel');

var prefsPromptForDelayLabel  = document.getElementById('prefs_prompt_for_delay_label');
prefsPromptForDelayLabel.textContent = i18n('prefsPromptForDelayLabel');


var prefsEvaluationHeading  = document.getElementById('prefs_evaluation_heading');
prefsEvaluationHeading.textContent = i18n('prefsEvaluationHeading');


var prefsRulesetLegend  = document.getElementById('prefs_ruleset_legend');
prefsRulesetLegend.textContent = i18n('prefsRulesetLegend');

var prefsAriaStrictLabel  = document.getElementById('aria_strict_label');
prefsAriaStrictLabel.textContent = i18n('prefsAriaStrictLabel');

var prefsAriaTransLabel  = document.getElementById('aria_trans_label');
prefsAriaTransLabel.textContent  = i18n('prefsAriaTransLabel');


var prefsRuleResultsLegend  = document.getElementById('prefs_rule_results_legend');
prefsRuleResultsLegend.textContent = i18n('prefsRuleResultsLegend');

var prefsIncludePassAndNALabel  = document.getElementById('prefs_include_pass_and_na_label');
prefsIncludePassAndNALabel.textContent  = i18n('prefsIncludePassAndNALabel');


var defaultButton  = document.getElementById('prefs_default');
defaultButton.textContent = i18n('prefsDefault');

var includeGuidelinesCheckbox = document.getElementById('prefs_include_guidelines_checkbox');

var rulesetAriaStrictRadio = document.getElementById('ARIA_STRICT');
var rulesetAriaTransRadio  = document.getElementById('ARIA_TRANS');

var noDelayRadio        = document.getElementById('prefs_no_delay_radio');
var promptForDelayRadio = document.getElementById('prefs_prompt_for_delay_radio');

var includePassAndNotApplicableCheckbox = document.getElementById('prefs_include_pass_and_na');

var reRunEvaluation = false;
// Restore Defaults

function handleResponse(message) {
  if (message) {
    console.log(`[PreferenceChange]: Message from the sidebar script:  ${message.response}`);
  }
  else {
    console.log('[PreferenceChange]: no response message');
  }
}

function notifySidebarOfPreferenceChanges() {
  var sending = browser.runtime.sendMessage({
    updatePreferences: "all"
  });
  sending.then(handleResponse, onError);
}


function handleResetDefault (event) {

  messageArgs.includeGuidelines = false;
  includeGuidelinesCheckbox.checked = false;

  messageArgs.promptForDelay = false;
  noDelayRadio.checked = true;

  if (messageArgs.ruleset !== 'ARIA_STRICT') {
    messageArgs.ruleset = 'ARIA_STRICT';
    rulesetAriaStrictRadio.checked = true;
    reRunEvaluation = true;
  }

  if (!messageArgs.includePassAndNotApplicable) {
    messageArgs.includePassAndNotApplicable = true;
    includePassAndNotApplicableCheckbox.checked = true;
    reRunEvaluation = true;
  }

  setAInspectorPreferences();
  notifySidebarOfPreferenceChanges();

};

defaultButton.addEventListener('click', handleResetDefault);

// Include Guidelines

function handleIncludeGuidelines (event) {
  messageArgs.includeGuidelines = includeGuidelinesCheckbox.checked;

  setAInspectorPreferences();
  notifySidebarOfPreferenceChanges();
};

includeGuidelinesCheckbox.addEventListener('click', handleIncludeGuidelines);

// Delay

function handleNoDelay (event) {
  if (noDelayRadio.checked) {
    messageArgs.promptForDelay = false;
    setAInspectorPreferences();
    notifySidebarOfPreferenceChanges();
  }
};

noDelayRadio.addEventListener('click', handleNoDelay);

function handlePromptForDelay (event) {
  if (promptForDelayRadio.checked) {
    messageArgs.promptForDelay = true;
    setAInspectorPreferences();
    notifySidebarOfPreferenceChanges();
  }
};

promptForDelayRadio.addEventListener('click', handlePromptForDelay);


// Set rulesets

function handleRulesetAriaStrict (event) {
  if (rulesetAriaStrictRadio.checked) {
    messageArgs.ruleset = 'ARIA_STRICT';
    setAInspectorPreferences();
    notifySidebarOfPreferenceChanges();
    reRunEvaluation = true;
  }
};

rulesetAriaStrictRadio.addEventListener('click', handleRulesetAriaStrict);

function handleRulesetAriaTrans (event) {
  if (rulesetAriaTransRadio.checked) {
    messageArgs.ruleset = 'ARIA_TRANS';
    setAInspectorPreferences();
    notifySidebarOfPreferenceChanges();
    reRunEvaluation = true;
  }
};

rulesetAriaTransRadio.addEventListener('click', handleRulesetAriaTrans);

// Include Pass and Not Applicable

function handleIncludePassAndNotApplicable (event) {
  messageArgs.includePassAndNotApplicable = includePassAndNotApplicableCheckbox.checked;
  setAInspectorPreferences();
  notifySidebarOfPreferenceChanges();
  reRunEvaluation = true;
};

includePassAndNotApplicableCheckbox.addEventListener('click', handleIncludePassAndNotApplicable);

var storedValue = browser.storage.local.get("ainspectorPreferences").then(updateAInspectorPreferencesPanel, onError);

function updateAInspectorPreferencesPanel(item) {
  var prefs = item.ainspectorPreferences;

  if (typeof prefs != 'undefined'){
    messageArgs = prefs;
  }
  else {
    setAInspectorPreferences();
  }

  if (messageArgs.promptForDelay) {
    promptForDelayRadio.checked = true;
  }
  else {
    noDelayRadio.checked = true;
  }

  includeGuidelinesCheckbox.checked = messageArgs.includeGuidelines;

  if (messageArgs.ruleset === 'ARIA_STRICT') {
    rulesetAriaStrictRadio.checked = true;
  }
  else {
    rulesetAriaTransRadio.checked = true;
  }

  includePassAndNotApplicableCheckbox.checked = messageArgs.includePassAndNotApplicable;

};
