import React from "react";
import Header from "./header/Header.jsx";
import Main from "./main/Main.jsx";
import moment from "moment";
import {
  createTask,
  fetchTasksList,
  deleteTask
} from "./tasksFunctions.js";
import {
  pastDay,
  sameTime,
  littleTime
} from "./main/functionFilter.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.creacteTask = this.creacteTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.showData = this.showData.bind(this);
    this.showHours = this.showHours.bind(this);
  }

  state = {
    ArrayOFWeek: [0, 1, 2, 3, 4, 5, 6],
    monday: moment().isoWeekday(1),
    saturday: moment().isoWeekday(6),
    open: false,
    delete: false,
    tasks: [],
    start: "",
    end: "",
    timeStart: "",
    timeEnd: "",
    id: ""
  };

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = () => {
    fetchTasksList().then(tasksList =>
      this.setState({
        tasks: tasksList,
        open: false
      })
    );
  };

  nextWeek = () => {
    this.setState({
      ArrayOFWeek: this.state.ArrayOFWeek.map(
        day => day + 7
      ),
      monday: this.state.monday.add(7, "days"),
      saturday: this.state.saturday.add(7, "days")
    });
  };

  lastWeek = () => {
    this.setState({
      ArrayOFWeek: this.state.ArrayOFWeek.map(
        day => day - 7
      ),
      monday: this.state.monday.add(-7, "days"),
      saturday: this.state.saturday.add(-7, "days")
    });
  };

  toDay = () => {
    this.setState({
      ArrayOFWeek: [0, 1, 2, 3, 4, 5, 6],
      monday: moment().isoWeekday(1),
      saturday: moment().isoWeekday(6)
    });
  };

  openPopap = () => {
    this.setState({
      open: true
    });
  };
  
  openClearPopap = () => {
    this.setState({
      open: true,
      start: "",
      end: "",
      timeStart: "",
      timeEnd: ""
    });
  }

  closePopap = () => {
    this.setState({
      open: false
    });
  };

  creacteTask(object, tasks) {
    let CorectTime = object.start < object.end;
    if (object.timeStart === "" || object.timeEnd === "") {
      alert("Please write date");
      return null;
    }
    if (sameTime(tasks, object).length > 0) {
      alert("time does not have to cross");
      return null;
    }
    if (!CorectTime) {
      alert("Write corect time or max date 23:45");
      return null;
    }
    if (pastDay(object)) {
      alert("Your time is over :)");
      return null;
    }
    if(littleTime(object)) {
      alert("task won't be less one hour")
      return null;
    }
    createTask(object).then(result => {
      this.fetchTasks();
    });
    this.setState({
      open: false,
      delete: true
    });
  }

  deleteTask(id) {
    deleteTask(id).then(result => {
      this.fetchTasks();
    });
  }

  showData(start, end, timeStart, timeEnd, id) {
    this.setState({
      start: start,
      end: end,
      timeStart: timeStart,
      timeEnd: timeEnd,
      id: id,
      delete:true
    });
  }

  showHours(start, end, timeStart, timeEnd) {
    this.setState({
      start: start,
      end: end,
      timeStart: timeStart,
      timeEnd: timeEnd,
      delete:false
    });
  }

  render() {
    return (
      <>
        <Header
          openClearPopap={this.openClearPopap}
          monday={this.state.monday}
          saturday={this.state.saturday}
          ArrayOFWeek={this.state.ArrayOFWeek}
          nextWeek={this.nextWeek}
          lastWeek={this.lastWeek}
          toDay={this.toDay}
        />
        <Main
          ArrayOFWeek={this.state.ArrayOFWeek}
          openPopap={this.openPopap}
          closePopap={this.closePopap}
          open={this.state.open}
          creacteTask={this.creacteTask}
          tasks={this.state.tasks}
          delete={this.state.delete}
          deleteTask={this.deleteTask}
          showData={this.showData}
          start={this.state.start}
          end={this.state.end}
          timeStart={this.state.timeStart}
          timeEnd={this.state.timeEnd}
          id={this.state.id}
          showHours={this.showHours}
        />
      </>
    );
  }
}

export default App;
