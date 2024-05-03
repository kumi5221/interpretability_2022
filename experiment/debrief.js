var timeline = [];

var debrief = {
    type: "html-keyboard-response",
    stimulus: "<p>This research study investigates people's ability to understand more complex concepts through combining existing ones. This ability is called conceptual combination. We are specifically trying to understand what cognitive systems are taking place when people understand the meaning of a novel combination of familiar concepts. We are interested to see how people's cognitive processes to use either linguistic or perceptual information differently affect the speed they can come up with a new interpretation.</p>"
    + "<p>We will fit the data to the computational model to determine what extent linguistic and perceptual information is used in mind to understand the new meanings of concepts. When people can come up with a new interpretation, they may experience seeing or hearing concepts as if they existed, compared to just thinking the concept as another word. We hope the model to predict how people use these different modalities of information depending on tasks at hand. The information gathered from this and subsequent studies may help to construct a better model that explains how people's fascinating ability to construct and understand more complex thoughts based off of existing concepts is possible. The insights could lead to potential applications in building an artificial intelligence model that can think of concepts as humans do. </p>"
    + "<p>Please feel free to contact Kumiko Nakajima (knakajim@iu.edu) if you have any questions about this experiment. </p>"
    +"<p>Please do not share the details of this study with other potential participants.  That would affect our ability to collect data. </p>"
    +"<p>Thank you for taking the time to participate in this study! Please type any key to end the experiment.</P>",
    on_finish: function(data){
    }
  };
  
  timeline.push(debrief)
  
  
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
  