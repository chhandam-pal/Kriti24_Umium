import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { allProject, recentProject, userProjects } from "../../api/project";
import { allGroups } from "../../api/groups";
import Navbar from "../../componets/navbar/navbar";
import Profile from "./componets/profile";
import MyProject from "./componets/my-project";
import Feed from "./componets/feed";
import Project from "./componets/project";
import './style.css';

function FeedPage({ user }) {
    const [allProjects, setAllProjects] = useState([]);
    const [userProject, setUserProject] = useState([]);
    const [groups, setGroups] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedAllProjects = await allProject();
            fetchedAllProjects.sort((a, b) => b.numberofRatings - a.numberofRatings);
            setAllProjects(fetchedAllProjects);

            const fetchedRecentProjects = await recentProject();
            fetchedRecentProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRecentProjects(fetchedRecentProjects);

            const fetchedAllGroups = await allGroups();
            setGroups(fetchedAllGroups);

            const fetchedUserProject = await userProjects(user._id);
            setUserProject(fetchedUserProject);
        };

        fetchData();
    }, [user._id]);

    console.log(recentProjects);

    return (
        <div>
            <Navbar />
            <div className="main-container">
                <div className="left-section">
                    <Profile user={user} />
                    <MyProject userProject={userProject} />
                </div>
                <div className="middle-section">
                    {recentProjects.length > 0 &&
                        recentProjects.map((project, index) => (
                            <Feed key={index} project={project} user={user} />
                        ))}
                </div>
                <div className="right-section">
                    <div className="top-projects">
                        <h2>Top Project</h2>
                        {allProjects.slice(0, 3).map((project, index) => (
                            <Project key={index} user={user} project={project} />
                        ))}
                        <p>Explore More</p>
                    </div>
                    <div className="top-groups">
                        <h2>Top Communities</h2>
                        {groups.slice(0, 2).map((group, index) => (
                            <Project key={index} condition="group" project={group} />
                        ))}
                        <p>
                            <Link to="/communities/">Explore More</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedPage;
