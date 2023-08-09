import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import {
  Avatar,
  Button,
  Chip,
  Grid,
  Modal,
  TextField,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PopupContext } from "../App";
import apiList from "./Apis";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  //   {
  //     id: "userId",
  //     numeric: false,
  //     disablePadding: false,
  //     label: "UserId",
  //   },
  // {
  //   id: "contactNumber",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Contact",
  // },
  {
    id: "application",
    numeric: true,
    disablePadding: false,
    label: "Total Applications",
  },
  {
    id: "resume",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all candidates" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? "right" : "left"}
            align="center"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarclasses = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

function EnhancedTableToolbar(props) {
  const classes = useToolbarclasses();
  const { numSelected, handleCandidateDelete } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Candidates
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon onClick={handleCandidateDelete} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useclasses = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    alignSelf: "center",
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
  actionButton: {
    marginRight: "10px",
  },
  statusBlock: {
    width: "120%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
    minHeight: "95%",
  },
}));
function ApplicationTile(props) {
  const styles = useclasses();
  const { application } = props;

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#0a8d24",
    accepted: "#0a8d24",
    rejected: "#e80f0f",
    deleted: "#d82828",
    cancelled: "#e32828",
    finished: "#e32828",
  };
  return (
    <Paper className={styles.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={8} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{application.job.title}</Typography>
          </Grid>
          <Grid item>
            Posted By:
            {application.recruiter.name}
          </Grid>
          <Grid item>Role :{application.job.jobType}</Grid>
          <Grid item>
            Salary : &#8377;
            {application.job.salary} per month
          </Grid>
          <Grid item>
            Duration :{" "}
            {application.job.duration !== 0
              ? `${application.job.duration} month`
              : "Flexible"}
          </Grid>
          <Grid item>
            {application.job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>
            Applied On:
            {appliedOn.toLocaleDateString()}
          </Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>
              Joined On:
              {joinedOn.toLocaleDateString()}
            </Grid>
          ) : null}
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={4}
          spacing={1}
          justifyContent="center"
        >
          <Grid item>
            <Paper
              className={styles.statusBlock}
              style={{
                background: colorSet[application.status],
                color: "#ffffff",
                padding: "6px 1px",
              }}
            >
              {application.status}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
function CandidateTable(props) {
  const { candidateList, handleDelete } = props;
  const setPopup = useContext(PopupContext);
  const navigate = useNavigate();

  console.log("Candidates  ", candidateList);
  useEffect(() => {
    // You can perform any additional operations here if needed
    setSelected([]);
  }, [candidateList]);
  const classes = useclasses();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("application");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
  });
  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);
  const [applications, setApplications] = useState([]);
  const [open, setOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = candidateList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, candidateList.length - page * rowsPerPage);

  const openResume = (filename, event) => {
    event.stopPropagation();
    console.log("file namee ", filename, "condition ", filename !== undefined);

    if (filename !== undefined && filename !== "") {
      window.open(
        `${apiList.downloadResume}/${encodeURIComponent(filename)}`,
        "_blank",
      );
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "You have not uploaded any resume.",
      });
    }
  };

  const openProfile = (selectedUserId, event) => {
    event.stopPropagation();
    const currentUserInfo = candidateList.find(
      ({ userId }) => userId === selectedUserId,
    );
    setProfileDetails(currentUserInfo);
    console.log("Profile details ", currentUserInfo);
    if (currentUserInfo.education.length > 0) {
      setEducation(
        currentUserInfo.education.map((edu) => ({
          institutionName: edu.institutionName ? edu.institutionName : "",
          startYear: edu.startYear ? edu.startYear : "",
          endYear: edu.endYear ? edu.endYear : "",
        })),
      );
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProfileDetails({
      name: "",
      education: [],
      skills: [],
      resume: "",
      profile: "",
    });
    setEducation([
      {
        institutionName: "",
        startYear: "",
        endYear: "",
      },
    ]);
    setApplications([]);
  };

  function EducationInput(props) {
    const styles = useclasses();
    const { education, setEducation } = props;
    return (
      <>
        {education.map((obj, key) => (
          <Grid item container className={styles.inputBox} key={key}>
            <Grid item xs={6}>
              <TextField
                label={`Institution Name #${key + 1}`}
                value={education[key].institutionName}
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Start Year"
                value={obj.startYear}
                variant="outlined"
                type="number"
                disabled
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="End Year"
                value={obj.endYear}
                variant="outlined"
                type="number"
                disabled
              />
            </Grid>
          </Grid>
        ))}
      </>
    );
  }

  function UserProfileInput() {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item xs>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container direction="column" alignItems="center" xs={2}>
              <Avatar
                src={`${profileDetails.profile}`}
                className={classes.avatar}
              />
              <Typography
                variant="h3"
                component="h2"
                style={{ color: "#3f51b5", fontWeight: "bold" }}
              >
                Profile
              </Typography>
            </Grid>
            <Grid container direction="column" alignItems="" spacing={3}>
              <Grid item>
                <TextField
                  label="Name"
                  value={profileDetails.name}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <EducationInput
                education={education}
                setEducation={setEducation}
              />
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={profileDetails.skills}
                  fullWidth
                  disabled
                />
              </Grid>

              {/* <Grid item>
                <Button
                  variant="contained"
                  className={classes.statusBlock}
                  color="primary"
                  onClick={() => getResume()}
                  style={{ alignItems: "center" }}
                >
                  View Uploaded Resume
                </Button>
              </Grid> */}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{
                padding: "10px 50px",
                marginTop: "30px",
                borderRadius: "8px",
                height: "50px",
              }}
              onClick={() => {
                handleClose();
              }}
            >
              Close
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  const handleCandidateDelete = () => {
    console.log("Selected ", selected);
    handleDelete(selected);
  };

  const openApplications = (userId, event) => {
    event.stopPropagation();

    axios
      .get(`${apiList.candidatesApplications}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Data -- >", response.data);
        setApplications(response.data);
        if (response.data.length > 0) {
          setApplicationOpen(true);
        } else {
          setPopup({
            open: true,
            severity: "error",
            message: "No application found",
          });
        }
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };
  const handleApplicationClose = () => {
    setApplicationOpen(false);
    setApplications([]);
  };

  function UserApplicationInput() {
    return (
      <div style={{ maxHeight: "535px", overflow: "auto" }}>
        <Grid container>
          <Grid>
            <Paper
              style={{
                padding: "20px",
                outline: "none",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    {applications.length > 0 ? (
                      applications.map((application) => (
                        <Grid item>
                          <ApplicationTile application={application} />
                        </Grid>
                      ))
                    ) : (
                      <Typography
                        variant="h5"
                        style={{
                          height: "50px",
                          textAlign: "center",
                          background: "rgba(255,255,255,0.5)",
                          marginLeft: "25%",
                          marginRight: "25%",
                          paddingTop: "15px",
                        }}
                      >
                        No Applicantions found
                      </Typography>
                    )}
                  </Grid>
                  <Grid item style={{ display: "flex", justifyContent: "end" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        padding: "5px 30px",
                        marginTop: "20px",
                        borderRadius: "8px",
                        height: "50px",
                      }}
                      onClick={() => {
                        handleApplicationClose();
                      }}
                    >
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleCandidateDelete={handleCandidateDelete}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={candidateList.length}
            />
            <TableBody>
              {stableSort(candidateList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.userId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.userId)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.userId}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell id={labelId} align="center">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">
                        {row.application.length}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={(event) => openResume(row.resume, event)}
                          className={classes.actionButton}
                        >
                          Resume
                        </Button>
                        <Button
                          variant="contained"
                          onClick={(event) => openProfile(row.userId, event)}
                          className={classes.actionButton}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="contained"
                          onClick={(event) =>
                            openApplications(row.userId, event)
                          }
                          className={classes.actionButton}
                        >
                          Applications
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={candidateList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <UserProfileInput />
      </Modal>
      <Modal
        open={applicationOpen}
        onClose={handleApplicationClose}
        className={classes.popupDialog}
      >
        <UserApplicationInput />
      </Modal>
    </div>
  );
}
export default CandidateTable;
