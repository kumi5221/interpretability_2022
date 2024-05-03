var subject_id = jsPsych.data.getURLVariable('sonaid')
console.log(subject_id)

//parse nonwords data
var nonwords_list = []
for (dict of nonwords){
  var temp = {}
  for(var key in dict){
    if(key == 'stimulus'){
      var comp = dict[key]
    }
    else{
      temp[key] = dict[key]
    }
  }
  new_dict = {stimulus: comp, data:temp}
  nonwords_list.push(new_dict)
}

//shuffle with seed (https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed)
function shuffle(array, seed) {
  var m = array.length, t, i;

  while (m) {
    i = Math.floor(random(seed) * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed
  }

  return array;
}

function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

//to equally divide subjects into sets
nonwords_list = shuffle(nonwords_list, 32)

var set_size = 200
var remaining_nonwords = nonwords_list.slice(nonwords_list.length-nonwords_list.length%set_size, nonwords_list.length)
console.log(remaining_nonwords.length)

function create_nonwords(set){
  var item = []

  if(set<=remaining_nonwords.length-1){
    item = remaining_nonwords[set]
  }

  var list = nonwords_list.slice((set_size-1)*set+set,((set_size-1)*set+set)+set_size).concat(item)
  list = jsPsych.randomization.shuffle(list)
  return list
}

/* randomization by hand
var num_set = parseInt(nonwords_list.length/set_size);
var set = Math.floor(Math.random()*(num_set));
var words_list = create_nonwords(set);
var items = remaining_nonwords.slice(remaining_nonwords.length/num_set*set, remaining_nonwords.length/num_set*set + (remaining_nonwords.length/num_set -1));
words_list = words_list.concat(items);
//words_list = jsPsych.randomization.shuffle(words_list)
console.log(nonwords.length);
console.log(num_set, set, words_list.length);
console.log(words_list);
*/

var words_list = jsPsych.randomization.shuffle(nonwords_list).slice(0, set_size);
console.log(words_list.length);
console.log(words_list);

/*  experiment */
var timeline = [];

var check_consent = function(elem) {
    if (document.getElementById('consent_checkbox').checked) {
      return true;
    }
    else {
      alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
      return false;
    }
    return false;
  };


var consentTrial = {
  type:'external-html',
  url: "../tests&examples/raceReproduction/consent.html",
  cont_btn: "start",
  check_fn: check_consent,
  on_finish: function(data){
    data.trial_type = "instruction"
  }
};


timeline.push(consentTrial);

/*
var informed_consent = {
  type: 'survey-multi-choice',
  questions:[{prompt:
    "<h3>INVITATION TO PARTICIPATE</h3>"
    + "<p>You are invited to participate in this research study investigating people's ability to understand more complex concepts through combining existing ones.  Researchers call this ability ''conceptual combination,'' and we are interested in what kind of cognitive system operates when people interpret new concepts. The study is being conducted by researchers associated with the Percepts and Concepts Laboratory at Indiana University. <p>"
    + "<p>This experiment requires Javascript functionality in your web browser. <p>"
    + "<h3>PURPOSE AND PROCEDURE FOR THIS STUDY</h3>"
    + "<p>The purpose of this study is to examine how people interpret new combinations of two familiar words. In this experiment, you will be shown new combinations, and you will be asked to respond yes or no to the question of whether you can come up with your interpretation of the new words. The procedure will take approximately 45 minutes.</p>"
    + "<p>You must be 18 years or older to participate. Please stay on task and do not switch between other activities, as that will interfere with the accuracy of this experiment.</p>"
    + "<h3>RISKS AND DISCOMFORTS</h3>"
    + "<p>There are no known risks or discomforts associated with this study.</p>"
    + "<h3>POTENTIAL BENEFITS</h3>"
    + "<p>By participating you may gain a greater understanding of experimental methods in cognitive science, and may also be interested in what cognitive scientists study.  If you are completing this experiment as part of SONA at IU, you will receive 1 credit for experimental participation.</p>"
    + "<h3>ASSURANCE FOR CONFIDENTIALITY</h3>"
    + "<p>Data will be stored on the server of the Percepts and Concepts Lab. All data will only be available to the researchers and will be protected by security. The information obtained in this study may be published in scientific journals or presented at scientific meetings, but your identity will be kept strictly confidential.  Information about your age, gender, native language, and dominant hand will be requested. </p>"
    + "<h3>WITHDRAWAL FROM PARTICIPATION</h3>"
    + "<p>Participation is voluntary.  Your decision whether or not to participate will not affect your present or future relationship with the Indiana University.  You are free to withdraw from this study at any time without penalty.</p>"
    + "<h3>OFFER TO ANSWER QUESTIONS</h3>"
    + "<p>If you have any questions regarding the experiment, please feel free to contact Kumiko Nakajima (knakajim@iu.edu) or Dr. Robert Goldstone (rgoldsto@indiana.edu). This project has been approved by the Indiana University Human Subjects Office.  Please contact at 800-696-2949 or at irb@iu.edu with any questions or concerns.</p>"
    + '<p>' + "<em>If you understand and agree to the above terms and are at least 18 years of age, select 'yes'. If not, select 'no' to end the experiment.</em>" + '</p>',
    required: true,
    options:["yes","no"]}],
  on_finish: function(data){
    if (JSON.parse(data.responses).Q0 == 'yes'){

      data.trial_type = "instruction"
      //var subject_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9);

      //For SONA
      var subject_id = jsPsych.data.getURLVariable('id')

      jsPsych.data.addProperties({subject: subject_id})
    }
    else {
    jsPsych.endExperiment("Thank you for visiting our experiment!")
    }
  }
}

//timeline.push(informed_consent)
*/

//instruction & practice
var instruction = {
  timeline: [
    {
      type: "html-keyboard-response",
      stimulus: "Welcome to the experiment. Press any key to begin."
    },
    {
      type: "html-keyboard-response",
      stimulus: "In this experiment, you will be asked to interpret various new combinations of two familiar words. For each combination presented on the screen, if you can think of a meaning of the combination, press the 'y' key to indicate 'yes'. If you cannot think of any meaning, press 'n' key to indicate 'no'. When pressing the 'y' key, please be sure that you have an interpretation of the word combination in mind. In other words, please do not press 'y' key until you come up with a meaning of the word combination. For each word you answer 'yes,' you will be asked the interpretation you came up with. Your interpretation has to be at least 5 words long. The experiment will be over when you have provided an interpretation for 80 word combinations. The procedure will take approximately 45 minutes. Please press any key to start practice."
    }
  ],
  on_finish: function(data){
    data.trial_type = "instruction"
    //assign a unique id
    //var subject_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9);
    //For SONA
    //var subject_id = jsPsych.data.getURLVariable('id')
    //if (subject_id === undefined) {subject_id = jsPsych.randomization.randomID(8)};
    //jsPsych.data.addProperties({subject: subject_id})
  }
}

timeline.push(instruction)

//task
var progress = 0.1
var key_press = null;
var end = false;
var count = 0;
var interpreted_num = 80;
var subject_interpretation = "";
var comp = ""

var fixation = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 250,
}
var blank = {
  type: 'html-keyboard-response',
  stimulus: "",
  choices: jsPsych.NO_KEYS,
  trial_duration: 250
}
var interpretability = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['y', 'n'],
  data: jsPsych.timelineVariable('data'),
  on_finish: function(data){
    comp = data.stimulus
    key_press = data.key_press
  }
}

var interpretation = {
  type: 'survey-text',
  questions: [{ prompt: "Enter your interpretation below.", columns: 50, required:true}],
  on_finish: function(data){
    subject_interpretation = JSON.parse(data.responses).Q0
    data.trial_type = "interpretation"
    data.responses = subject_interpretation
    data.stimulus = comp
  }
}


var interpretations = {
  timeline: [interpretation],
  loop_function: function(){
    if(subject_interpretation.split(' ').length < 5){
      window.alert("Interpretation should be at least 5 words long.");
      return true;
    } else {
      count++;
      progress += 0.8/interpreted_num;
      jsPsych.setProgressBar(progress);
      return false;
    }
  },
  on_finish: function () {
    if (count >= interpreted_num){
        end = true;
    }
  }
}

var interpretations_practice = {
  timeline: [interpretation],
  loop_function: function(){
    if(subject_interpretation.split(' ').length < 5){
      window.alert("Interpretation should be at least 5 words long.");
      return true;
    } else {
      return false;
    }
  }
}

var check_count = {
  type: 'call-function',
  func: function() {
    if (count >= interpreted_num){
      end = true;
    }
  }
}

var interpretable = {
  timeline: [interpretations],
  conditional_function: function(){
    if (jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(key_press) == 'y'){
      return true;
    } else {
      return false;
    }
  }
}

var interpretable_practice = {
  timeline: [interpretations_practice],
  conditional_function: function(){
    if (jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(key_press) == 'y'){
      return true;
    } else {
      return false;
    }
  }
}

var interpretation_example = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('answer')
}

var check = {
  type: 'call-function',
  func: function() {
      if (end) {
          // this method now works because it's being called on the main task timeline,
          // rather than from inside of a conditional node
          jsPsych.endCurrentTimeline();
      }
  }
}

var task = {
    timeline: [fixation, blank, interpretability, interpretable, check_count, check],
    timeline_variables: words_list,
    repetitions: 1
};

var practice = {
  timeline: [fixation, blank, interpretability, interpretable_practice, interpretation_example],
  timeline_variables: [
    {stimulus: "octopus apartment", answer: 'For "octopus apartment", you could answer "an apartment with eight rooms" or "an apartment where an octopus lives" among many others.', data:{word_validity:"practice"}},
    {stimulus: "elephant complaint", answer: 'For "elephant complaint", you could answer "a complaint that people make about the behavior of an elephant at a zoo" or "a long-living complaint that is never resolved" among many others.', data:{word_validity:"practice"}},
  ],
  on_finish: function(data){
    data.trial_type = "instruction"
  }
};

timeline.push(practice)

var pretask = {
  type: "html-keyboard-response",
  stimulus: "You have now completed the practice trials. For the actual experiment -- starting from now -- you will be shown new combinations of words. As a reminder, please do not press 'y' key until you come up with the meaning of the combination. Your interpretation has to be at least 5 words long. The experiment will be over when you have answered 'yes' to the question for 80 word combinations. Press any key to start the actual trials.",
  on_finish: function(data){
    data.trial_type = "instruction"
  }
}

timeline.push(pretask)

timeline.push(task)


/* survey */
var demographics1 = {
  type: 'survey-text',
  questions: [{ prompt: "<p>How old are you</p>",required: true,columns: 2}],
  on_finish: function(data){
    var age = JSON.parse(data.responses).Q0
    jsPsych.data.addProperties({"age": age})
  }
}

var demographics2 = {
  type: 'survey-multi-choice',
    questions:[
      {prompt:"What is your gender?", name: "gender", options:["female",	"male", "others"],required:true},
      {prompt:"Is English your native language?", name: "lang", options:["yes",	"no"],required:true},
      {prompt:"Which hand is your dominant hand?", name: "handedness", options:["left",	"right"], required:true}
    ],
  on_finish: function(data){
    var parsed = JSON.parse(data.responses);
    var gender = parsed.gender;
    var lang = parsed.lang;
    var handedness = parsed.handedness;
    jsPsych.data.addProperties({gender: gender, lang: lang, handedness: handedness});

    var subject_id = jsPsych.data.getURLVariable('sonaid')
    if (subject_id === undefined) {subject_id = jsPsych.randomization.randomID(8)};
    jsPsych.data.addProperties({subject: subject_id})
  }
}

timeline.push(demographics1, demographics2)


var debrief = {
  type: "html-keyboard-response",
  stimulus: "<p>This research study investigates people's ability to understand more complex concepts through combining existing ones. This ability is called conceptual combination. We are specifically trying to understand what cognitive systems are taking place when people understand the meaning of a novel combination of familiar concepts. We are interested to see how people's cognitive processes to use either linguistic or perceptual information differently affect the speed they can come up with a new interpretation.</p>"
  + "<p>We will fit the data to the computational model to determine what extent linguistic and perceptual information is used in mind to understand the new meanings of concepts. When people can come up with a new interpretation, they may experience seeing or hearing concepts as if they existed, compared to just thinking the concept as another word. We hope the model to predict how people use these different modalities of information depending on tasks at hand. The information gathered from this and subsequent studies may help to construct a better model that explains how people's fascinating ability to construct and understand more complex thoughts based off of existing concepts is possible. The insights could lead to potential applications in building an artificial intelligence model that can think of concepts as humans do. </p>"
  + "<p>Please feel free to contact Kumiko Nakajima (knakajim@iu.edu) if you have any questions about this experiment. </p>"
  +"<p>Please do not share the details of this study with other potential participants.  That would affect our ability to collect data. </p>"
  +"<p>Thank you for taking the time to participate in this study! Please type any key to end the experiment.</P>",
  on_finish: function(data){
    data.trial_type = "instruction"
    jsPsych.setProgressBar(1.0)

    var exp = jsPsych.data.get().ignore('question_order').ignore('internal_node_id').ignore('trial_index').filterCustom(function(trial){
    return (trial.trial_type == "html-keyboard-response" || trial.trial_type == "interpretation") && trial.rt != null
    }).json();

    //save in the lab server
    save_server_data(exp);
  }
};

timeline.push(debrief)

//save data to MySQL
function save_data(data) {
  $.ajax({
    type: 'post',
    cache: false,
    url: 'php/write_data.php',
    data: {
      "table": "interpretation",
      "new_data": data
    }
  });
}

//save data to the server
function save_server_data (data) {
  //var data = jsPsych.data.get().json();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'kumi_save_json.php');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ filedata: data }));
}

jsPsych.init({
  timeline: timeline,
  show_progress_bar: true,
  auto_update_progress_bar:false,
  on_close: function() {

    /*
    //save data in the local machine
    jsPsych.data.get().ignore('question_order').ignore('internal_node_id').ignore('trial_index').filterCustom(function(trial){
    return (trial.trial_type == "html-keyboard-response" || trial.trial_type == "interpretation") && trial.rt != null
    }).localSave('csv','test.csv');
    */

    //var exp = jsPsych.data.get().ignore('question_order').ignore('internal_node_id').ignore('trial_index').filterCustom(function(trial){
    //return (trial.trial_type == "html-keyboard-response" || trial.trial_type == "interpretation") && trial.rt != null
    //}).json();

    //save in the lab server
    //save_server_data(exp);

  }
  });
