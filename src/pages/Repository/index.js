import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import {
  Loading,
  Owner,
  IssueList,
  Select,
  Loader,
  ButtonPage,
  ButtonChange,
} from './styles';
import Container from '../../components/container';

export default class Repository extends Component {
  // validação propTypes
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    stateIssues: 'all',
    page: 1,
    buttonLeft: false,
    buttonRight: false,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { stateIssues, page } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      this.getIssuesFromAPI(repoName, stateIssues, page),
    ]);

    this.setState({
      repository: repository.data,
      issues,
      loading: false,
    });
  }

  handleChange = async e => {
    const { match } = this.props;
    const stateIssues = e.target.value;

    const repoName = decodeURIComponent(match.params.repository);

    const issues = await this.getIssuesFromAPI(repoName, stateIssues, 1);

    this.setState({
      issues,
      stateIssues,
      page: 1,
    });
  };

  handleButtonLeft = async () => {
    this.setState({ buttonLeft: true });
    const { page, stateIssues } = this.state;
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const issues = await this.getIssuesFromAPI(repoName, stateIssues, page - 1);

    this.setState({
      page: page - 1,
      issues,
    });
  };

  handleButtonRight = async () => {
    this.setState({ buttonRight: true });
    const { page, stateIssues } = this.state;
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const issues = await this.getIssuesFromAPI(repoName, stateIssues, page + 1);

    this.setState({
      page: page + 1,
      issues,
    });
  };

  getIssuesFromAPI = async (repoName, state, page) => {
    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state,
        page,
        per_page: 5,
      },
    });

    return issues.data;
  };

  render() {
    const {
      repository,
      issues,
      loading,
      buttonLeft,
      buttonRight,
      page,
    } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <Select value={this.stateIssues} onChange={this.handleChange}>
          <option value="all">Todos</option>
          <option value="open">Aberto</option>
          <option value="closed">Fechado</option>
        </Select>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <ButtonPage>
          <ButtonChange
            onClick={this.handleButtonLeft}
            title="Avançar uma página"
            disabled={page === 1}
          >
            {buttonLeft ? (
              <Loader>
                <FaSpinner />
              </Loader>
            ) : (
              <FaArrowLeft />
            )}
          </ButtonChange>
          <p>Página {page}</p>
          <ButtonChange
            onClick={this.handleButtonRight}
            title="Avançar uma página"
          >
            {buttonRight ? (
              <Loader>
                <FaSpinner />
              </Loader>
            ) : (
              <FaArrowRight />
            )}
          </ButtonChange>
        </ButtonPage>
      </Container>
    );
  }
}
