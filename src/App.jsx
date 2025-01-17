import { useEffect, useState } from 'react';
import NewProject from './NewProject';
import NoContent from './NoContent';
import ProjectsSideBar from './ProjectsSideBar';
import SelectedProject from './SelectedProject';
import { RiMenu4Line } from 'react-icons/ri';

function App() {
  // const id = useId();
  let dataId = 'ProjectSelected';
  const getData = window.localStorage.getItem('isOpen');

  const [isOpen, setIsOpen] = useState(() => {
    return JSON.parse(getData) || false;
  });
  const [projectSelected, setProjectSelected] = useState(() => {
    return (
      JSON.parse(localStorage.getItem(dataId)) || {
        selectedProjectsId: undefined,
        projects: [],
        // tasks: [],
      }
    );
  });

  // Save data to local storage whenever projectSelected changes
  useEffect(() => {
    window.localStorage.setItem(dataId, JSON.stringify(projectSelected));
  }, [projectSelected]);

  useEffect(() => {
    const getData = window.localStorage.getItem('isOpen');
    setIsOpen(JSON.parse(getData));
    console.log(getData);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('isOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const handleToogle = () => {
    setIsOpen((open) => !open);
  };

  const handleAddTasks = (text) => {
    setProjectSelected((prevSelected) => {
      const taskId = Math.floor(Math.random() * 100) + 1;
      const newTasks = {
        text: text,
        // projectId: prevSelected.selectedProjectsId,
        id: taskId,
      };

      const projectIndex = prevSelected.projects.findIndex((project) => project.id === prevSelected.selectedProjectsId);

      // Create a copy of the selected project with the new task added
      const updatedProjects = [...prevSelected.projects];

      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        tasks: [...updatedProjects[projectIndex].tasks, newTasks],
      };

      return {
        ...prevSelected,
        projects: updatedProjects,
      };
    });
  };

  const handleDeleteTasks = (id) => {
    setProjectSelected((prevSelected) => {
      return {
        ...prevSelected,
        tasks: prevSelected.tasks.filter((task) => task.id !== id),
      };
    });
  };

  const handleStartProjects = () => {
    setProjectSelected((prevSelected) => {
      return {
        ...prevSelected,
        selectedProjectsId: null,
      };
    });
  };

  const handleStopProjects = () => {
    setProjectSelected((prevSelected) => {
      return {
        ...prevSelected,
        selectedProjectsId: undefined,
      };
    });
  };

  const handleCreateNewProjects = (projectData) => {
    setProjectSelected((prevSelected) => {
      const newProject = {
        ...projectData,
        id: Math.floor(Math.random() * 100) + 1,
        tasks: [],
      };

      return {
        ...prevSelected,
        selectedProjectsId: undefined,
        projects: [...prevSelected.projects, newProject],
      };
    });
  };

  const handleSelectedList = (id) => {
    setProjectSelected((prevSelected) => {
      return {
        ...prevSelected,
        selectedProjectsId: id,
      };
    });
  };

  const handleDeleteItems = () => {
    setProjectSelected((prevSelected) => {
      return {
        ...prevSelected,
        selectedProjectsId: undefined,
        projects: prevSelected.projects.filter((project) => project.id !== prevSelected.selectedProjectsId),
      };
    });
  };

  const selectedList = projectSelected.projects.find((project) => project.id === projectSelected.selectedProjectsId);

  let content = <SelectedProject project={selectedList} onDelete={handleDeleteItems} onAddTasks={handleAddTasks} onDeleteTasks={handleDeleteTasks} tasks={selectedList?.tasks} projectId={projectSelected.selectedProjectsId} />;

  if (projectSelected.selectedProjectsId === undefined) {
    content = <NoContent onSubmit={handleStartProjects} />;
  } else if (projectSelected.selectedProjectsId === null) {
    content = <NewProject onStop={handleStopProjects} addData={handleCreateNewProjects} handleOpen={handleToogle} />;
  }
  return (
    <main className="h-screen my-8 flex gap-8 ">
      <RiMenu4Line className="text-3xl font-bold ml-6 absolute top-7 bg-stone-50 md:hidden" onClick={() => handleToogle()} />
      <ProjectsSideBar
        onSubmit={handleStartProjects}
        projects={projectSelected.projects}
        onSelectedList={handleSelectedList}
        selectedListId={projectSelected.selectedProjectsId}
        classNames={isOpen && ' max-sm:translate-x-0 max-sm:w-3/4 max-sm:transition-all max-sm:duration-300'}
        handleClose={() => handleToogle()}
      />
      {content}
    </main>
  );
}

export default App;
