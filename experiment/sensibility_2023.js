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
//console.log(nonwords_list)

//to equally divide subjects into sets
//nonwords_list = shuffle(nonwords_list, 32)

var set_size = 20
//var remaining_nonwords = nonwords_list.slice(nonwords_list.length-nonwords_list.length%set_size, nonwords_list.length)
//console.log(remaining_nonwords.length)
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


//timeline.push(consentTrial); //ENABLE!!!

//instruction & practice
var instruction = {
  timeline: [
    {
      type: "html-keyboard-response",
      stimulus: "Welcome to the experiment! Press any key to begin."
    },
    {
      type: "html-keyboard-response",
      stimulus: "In this experiment, you will see various novel combinations of two familiar words; some of these combinations would be familiar, while others would not. For each combination presented on the screen, if the combination makes sense, press the 'C' key to indicate 'yes'. If the combination is nonsense, press the 'N' key to indicate 'no'. Please respond as quickly and accurately as possible. The procedure will take approximately 30 minutes. Please press any key to start practice."
    }
  ],
  on_finish: function(data){
    data.trial_type = "instruction"
    //var subject_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9);
    //For SONA
    var subject_id = jsPsych.data.getURLVariable('id')
    if (subject_id === undefined) {subject_id = jsPsych.randomization.randomID(8)};
    jsPsych.data.addProperties({subject: subject_id})
  }
}

timeline.push(instruction)

//task
var progress = 0
var key_press = null;
//var end = false;
//var count = 0;
//var subject_interpretation = "";
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
var sensibility = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['c', 'n'],
  data: jsPsych.timelineVariable('data'),
  on_finish: function(data){
    comp = data.stimulus
    key_press = data.key_press
    progress += 0.98/words_list.length;
    jsPsych.setProgressBar(progress);
  }
}

var sensibility_practice = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['c', 'n'],
  data: jsPsych.timelineVariable('data'),
  on_finish: function(data){
    comp = data.stimulus
    key_press = data.key_press
  }
}

var task = {
    timeline: [fixation, blank, sensibility],
    timeline_variables: words_list,
    repetitions: 1
};

var practice = {
  timeline: [fixation, blank, sensibility_practice],
  timeline_variables: [
    {stimulus: "bag streak", data:{word_validity:"practice"}},
    {stimulus: "sun shine", data:{word_validity:"practice"}},
    {stimulus: "leg fork", data:{word_validity:"practice"}},
    /*{stimulus: "tooth dream", data:{word_validity:"practice"}},
    {stimulus: "mouth pig", data:{word_validity:"practice"}},
    {stimulus: "camp fire", data:{word_validity:"practice"}},*/
  ],
  on_finish: function(data){
    data.trial_type = "instruction"
  }
};

timeline.push(practice)

var pretask = {
  type: "html-keyboard-response",
  stimulus: "You have now completed the practice trials. For the actual experiment -- starting from now -- you will be shown new combinations of words. As a reminder, please respond as quickly and accurately as possible. Press any key to start the actual trials.",
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
  stimulus: '<p style="font-weight: bold;">Debrief Form<p>'
  + "<p>This research study investigates people's ability to understand more complex concepts by combining existing ones. This ability is called conceptual combination. We are specifically trying to understand what cognitive systems are taking place when people judge the meaning of a novel combination of familiar concepts. We are interested in seeing how people's cognitive processes of using either linguistic or perceptual information differently affect the speed at which they make sense of a new combination.</p>"
  + "<p>We will fit the data to the computational model to determine to what extent linguistic and perceptual information is used in mind to understand the new meanings of concepts. When people need to make sense of a new combination quickly, they may use the statistical information of these words seen together before. On the other hand, they may rely more on seeing or hearing concepts as if they existed to generate an actual interpretation of the concept. We hope the model will predict how people use these different modalities of information depending on the tasks at hand. The information gathered from this and subsequent studies may help to construct a better model that explains how people's fascinating ability to construct and understand more complex thoughts based on existing concepts is possible. The insights could lead to potential applications in building an artificial intelligence model that can think of concepts as humans do. </p>"
  + "<p>Please feel free to contact Kumiko Nakajima (kumiko.nakajima5221@gmail.com) if you have any questions about this experiment. </p>"
  +"<p>Please do not share the details of this study with other potential participants.  That would affect our ability to collect data. </p>"
  +"<p>Thank you for taking the time to participate in this study! Please type any key to end the experiment.</P>",
  on_finish: function(data){
    data.trial_type = "instruction"
    jsPsych.setProgressBar(1.0)

    var exp = jsPsych.data.get().ignore('question_order').ignore('internal_node_id').ignore('trial_index').filterCustom(function(trial){
    return (trial.trial_type == "html-keyboard-response") && trial.rt != null
    }).json();

    //save in the lab server
    save_server_data(exp);

    //save data in the local machine
    jsPsych.data.get().ignore('question_order').ignore('internal_node_id').ignore('trial_index').filterCustom(function(trial){
      return (trial.trial_type == "html-keyboard-response") && trial.rt != null
      }).localSave('csv','test.csv');
      
    //jsPsych.data.get().ignore('question_order').ignore('internal_node_id').ignore('trial_index').filterCustom(function(trial){
    //return (trial.trial_type == "html-keyboard-response" || trial.trial_type == "interpretation") && trial.rt != null
    //}).localSave('csv','test.csv');

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

  }
  });
