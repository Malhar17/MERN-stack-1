import React from "react";
import "./UserList.scss";
import UserItem from "./UserItem";

const UserList = (props) => {
  if (!props.items || props.items.length === 0) {
    return (
      <div className="center">
        <h2>No Users found</h2>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UserList;
